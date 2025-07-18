import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '@/api/models/user';
import { hashPassword, verifyPassword } from '@/utils/password';
import { signToken } from '@/utils/jwt';
import deleteCloudinaryImage from '@/utils/cloudinary';
import { validateEmail, validateNickname, validatePassword } from '@/utils/validation';
import { sendConfirmationEmail } from '@/utils/email';
import { AuthenticatedRequest, TokenPayload } from '@/types';
import { handleMongooseError } from '@/utils/error';

export const verifyUser = async (req: Request, res: Response) => {
    try {
        res.status(200).json({ message: 'Session is valid' });
    } catch (error) {
        res.status(401).json({ error: 'Not authenticated' });
    }
};

export const logoutUser = (req: Request, res: Response) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: Boolean(process.env.IS_PRODUCTION),
            sameSite: 'strict',
            domain: process.env.COOKIE_DOMAIN,
        });

        res.status(200).json({ message: 'Logged out successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error logging out' });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const emailValidation = validateEmail(email);
        if (!emailValidation.valid) {
            return res.status(400).json({ error: emailValidation.message });
        }

        const user = await User.findOne({ email }).select('-role').lean();

        if (!user) {
            return res.status(400).json({ error: `Incorrect email or password` });
        }

        if (user.status !== 'active') {
            return res.status(400).json({
                error: 'Your email is not confirmed. Please check your inbox for the confirmation email.',
            });
        }

        const validPassword = await verifyPassword(password, user.password);

        if (!validPassword) {
            return res.status(400).json({ error: `Incorrect email or password` });
        }

        const token = signToken({ id: user._id.toString() });

        // Set the JWT token in an HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true, // Prevent access via JavaScript
            secure: Boolean(process.env.IS_PRODUCTION),
            maxAge: 2 * 60 * 60 * 1000, // Token expires in 2 hours
            sameSite: 'strict', // Prevent cross-site request forgery (CSRF)
            domain: process.env.COOKIE_DOMAIN, // to share the cookie with subdomains
        });

        const { password: unusedPassword, ...restUser } = user;
        res.status(200).json({ data: { user: restUser } });
    } catch (err) {
        res.status(400).json({ error: 'Error login' });
    }
};

export const updateUserAvatar = async (req: Request, res: Response) => {
    if (!req.file || !req.file.path) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const { path } = req.file;
    const { id } = (req as AuthenticatedRequest).user;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.avatar) {
            await deleteCloudinaryImage(user.avatar);
        }

        if (path) {
            await User.findByIdAndUpdate(id, { avatar: path }, { new: true });
            return res.status(201).json({ data: path });
        }

        return res.status(200).json({ message: 'Avatar uploaded successfully' });
    } catch (error) {
        console.error('Error updating avatar:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteUserAvatar = async (req: Request, res: Response) => {
    const { id } = (req as AuthenticatedRequest).user;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.avatar) {
            await deleteCloudinaryImage(user.avatar);
            await User.findByIdAndUpdate(id, { avatar: null }, { new: true });
        }

        return res.status(200).json({ message: 'Avatar deleted successfully' });
    } catch (error) {
        console.error('Error deleting avatar:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateUserAccount = async (req: Request, res: Response) => {
    try {
        const { id } = (req as AuthenticatedRequest).user;
        const { nickname } = req.body;

        const oldUser = await User.findById(id);
        if (!oldUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        const updateFields = {} as Record<string, any>;

        if (nickname !== undefined) {
            const nicknameValidation = validateNickname(nickname);
            if (!nicknameValidation.valid) {
                return res.status(400).json({ error: nicknameValidation.message });
            }
            updateFields.nickname = nickname;
        }

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ error: 'No valid fields provided for update.' });
        }

        const updatedUser = await User.findByIdAndUpdate(id, updateFields, { new: true }).lean();

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        const { password: _, ...restUser } = updatedUser;
        return res.status(200).json({ data: restUser });
    } catch (err) {
        console.error('Error updating user:', err);
        return handleMongooseError(err, res);
    }
};

export const getUser = async (req: Request, res: Response) => {
    try {
        const { id } = (req as AuthenticatedRequest).user;

        const user = await User.findById(id)
            .select('-password -role')
            .populate({
                path: 'scores',
                populate: {
                    path: 'game_id',
                    select: 'name cover',
                },
            });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ data: user });
    } catch (error) {
        res.status(400).json({ error: 'Error fetching user details' });
    }
};

export const updateUserPassword = async (req: Request, res: Response) => {
    try {
        const { id } = (req as AuthenticatedRequest).user;
        const { password, newPassword } = req.body;

        if (!password) {
            return res.status(400).json({ error: 'No current password provided' });
        }

        if (!newPassword) {
            return res.status(400).json({ error: 'No password provided' });
        }

        const oldUser = await User.findById(id);
        if (!oldUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        const validPassword = await verifyPassword(password, oldUser.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        const passwordValidation = validatePassword(newPassword);
        if (!passwordValidation.valid) {
            return res.status(400).json({ error: passwordValidation.message });
        }

        const hashedPassword = await hashPassword(newPassword);

        await User.findByIdAndUpdate(id, { password: hashedPassword }, { new: true });

        res.clearCookie('token', {
            httpOnly: true,
            secure: Boolean(process.env.IS_PRODUCTION),
            sameSite: 'strict',
            domain: process.env.COOKIE_DOMAIN,
        });

        return res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating password:', error);
        return res.status(500).json({ error: 'An unexpected error occurred while updating the password.' });
    }
};

// Register User
export const registerUser = async (req: Request, res: Response) => {
    try {
        const { email, nickname, password } = req.body;

        const emailValidation = validateEmail(email);
        if (!emailValidation.valid) {
            return res.status(400).json({ error: emailValidation.message });
        }

        const userDuplicated = await User.findOne({ email });
        if (userDuplicated) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const nicknameValidation = validateNickname(nickname);
        if (!nicknameValidation.valid) {
            return res.status(400).json({ error: nicknameValidation.message });
        }

        const passwordValidation = validatePassword(password);
        if (!passwordValidation.valid) {
            return res.status(400).json({ error: passwordValidation.message });
        }

        const newUser = new User({ email, nickname, password });
        const user = await newUser.save();

        const token = jwt.sign({ id: user._id }, process.env.EMAIL_CONFIRMATION_SECRET!, {
            expiresIn: '15m',
        });

        const { data, error } = await sendConfirmationEmail(email, token);

        if (error) {
            return res.status(400).json({ error });
        }
        console.log(data);

        res.status(200).json({ message: 'Confirmation email sent. Please check your inbox.' });
    } catch (err: any) {
        console.error('Error registering user:', err);
        return handleMongooseError(err, res);
    }
};

// Confirm Email Endpoint
export const confirmEmail = async (req: Request, res: Response) => {
    try {
        const { token } = req.body;

        if (token == null || !token) {
            return res.status(400).json({ error: 'Token is required' });
        }

        const decoded = jwt.verify(token, process.env.EMAIL_CONFIRMATION_SECRET!) as TokenPayload;

        const user = await User.findById(decoded.id);
        if (!user || user.status !== 'pending') {
            return res.status(400).json({ error: 'Invalid or already confirmed token' });
        }

        user.status = 'active';

        await User.findByIdAndUpdate(user.id, { status: 'active' }, { new: true });

        res.status(200).json({ message: 'Email confirmed. Your account is now active.' });
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: 'Invalid or expired token' });
    }
};

// Resend Confirmation Email Endpoint
export const resendConfirmationEmail = async (req: Request, res: Response) => {
    const { email } = req.body;

    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
        return res.status(400).json({ error: emailValidation.message });
    }

    try {
        const user = await User.findOne({ email });

        if (!user || user.status === 'active') {
            return res.status(400).json({ error: 'User already confirmed or does not exist.' });
        }

        const token = jwt.sign({ id: user._id }, process.env.EMAIL_CONFIRMATION_SECRET!, { expiresIn: '15m' });

        const { data, error } = await sendConfirmationEmail(email, token);

        if (error) {
            return res.status(400).json({ error });
        }
        console.log(data);

        res.status(200).json({ message: 'Confirmation email has been resent. Please check your inbox.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error resending confirmation email.' });
    }
};
