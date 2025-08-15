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
import { sendError, sendSuccess } from '@/utils/response';

export const verifyUser = async (req: Request, res: Response) => {
    try {
        return sendSuccess(res, 200, {
            i18n: 'user.verified',
            message: 'User is verified',
        });
    } catch (err) {
        console.error('[verifyUser] Error: ', err);
        return sendError(res, 401, {
            i18n: 'user.not_authenticated',
            message: 'Not authenticated',
        });
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

        return sendSuccess(res, 200, {
            i18n: 'user.logout_success',
            message: 'User logged out successfully',
        });
    } catch (err) {
        console.error('[logoutUser] Error: ', err);
        return sendError(res, 500, {
            i18n: 'user.logout_error',
            message: 'An unexpected error occurred while logging out.',
        });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const emailValidation = validateEmail(email);
        if (!emailValidation.valid) {
            return sendError(res, 400, {
                i18n: 'user.invalid_email',
                message: emailValidation.message,
            });
        }

        const user = await User.findOne({ email }).select('-role').lean();

        if (!user) {
            return sendError(res, 400, {
                i18n: 'user.incorrect_credentials',
                message: 'Incorrect email or password',
            });
        }

        if (user.status !== 'active') {
            return sendError(res, 400, {
                i18n: 'user.email_not_confirmed',
                message: 'Your email is not confirmed. Please check your inbox for the confirmation email.',
            });
        }

        const validPassword = await verifyPassword(password, user.password);

        if (!validPassword) {
            return sendError(res, 400, {
                i18n: 'user.incorrect_credentials',
                message: 'Incorrect email or password',
            });
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

        return sendSuccess(res, 200, {
            i18n: 'user.login_success',
            message: 'User logged in successfully',
            payload: restUser,
        });
    } catch (err) {
        console.error('[loginUser] Error: ', err);
        return sendError(res, 500, {
            i18n: 'user.login_error',
            message: 'Error logging in',
        });
    }
};

export const updateUserAvatar = async (req: Request, res: Response) => {
    if (!req.file || !req.file.path) {
        return sendError(res, 400, {
            i18n: 'user.no_file_uploaded',
            message: 'No file uploaded',
        });
    }

    const { path } = req.file;
    const { id } = (req as AuthenticatedRequest).user;

    try {
        const user = await User.findById(id);
        if (!user) {
            return sendError(res, 404, {
                i18n: 'user.not_found',
                message: 'User not found',
            });
        }

        if (user.avatar) {
            await deleteCloudinaryImage(user.avatar);
        }

        if (path) {
            await User.findByIdAndUpdate(id, { avatar: path }, { new: true });
            return sendSuccess(res, 201, {
                i18n: 'user.avatar_updated',
                message: 'Avatar updated successfully',
                payload: path,
            });
        }

        return sendSuccess(res, 200, {
            i18n: 'user.avatar_uploaded',
            message: 'Avatar uploaded successfully',
        });
    } catch (error) {
        console.error('[updateUserAvatar] Error:', error);
        return sendError(res, 500, {
            i18n: 'user.avatar_update_error',
            message: 'Error updating avatar',
        });
    }
};

export const deleteUserAvatar = async (req: Request, res: Response) => {
    const { id } = (req as AuthenticatedRequest).user;

    try {
        const user = await User.findById(id);
        if (!user) {
            return sendError(res, 404, {
                i18n: 'user.not_found',
                message: 'User not found',
            });
        }

        if (user.avatar) {
            await deleteCloudinaryImage(user.avatar);
            await User.findByIdAndUpdate(id, { avatar: null }, { new: true });
        }

        return sendSuccess(res, 200, {
            i18n: 'user.avatar_deleted',
            message: 'Avatar deleted successfully',
        });
    } catch (error) {
        console.error('[deleteUserAvatar] Error:', error);
        return sendError(res, 500, {
            i18n: 'user.avatar_delete_error',
            message: 'Error deleting avatar',
        });
    }
};

export const updateUserAccount = async (req: Request, res: Response) => {
    try {
        const { id } = (req as AuthenticatedRequest).user;
        const { nickname } = req.body;

        const oldUser = await User.findById(id);
        if (!oldUser) {
            return sendError(res, 404, {
                i18n: 'user.not_found',
                message: 'User not found',
            });
        }

        const updateFields = {} as Record<string, any>;

        if (nickname !== undefined) {
            const nicknameValidation = validateNickname(nickname);
            if (!nicknameValidation.valid) {
                return sendError(res, 400, {
                    i18n: 'user.invalid_nickname',
                    message: nicknameValidation.message,
                });
            }
            updateFields.nickname = nickname;
        }

        if (Object.keys(updateFields).length === 0) {
            return sendError(res, 400, {
                i18n: 'user.no_valid_fields',
                message: 'No valid fields provided for update.',
            });
        }

        const updatedUser = await User.findByIdAndUpdate(id, updateFields, { new: true }).lean();

        if (!updatedUser) {
            return sendError(res, 404, {
                i18n: 'user.not_found',
                message: 'User not found',
            });
        }

        const { password: _, ...restUser } = updatedUser;

        return sendSuccess(res, 200, {
            i18n: 'user.updated',
            message: 'User updated successfully',
            payload: restUser,
        });
    } catch (err) {
        console.error('[updateUserAccount] Error:', err);
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
            return sendError(res, 404, {
                i18n: 'user.not_found',
                message: 'User not found',
            });
        }

        return sendSuccess(res, 200, {
            i18n: 'user.fetched',
            message: 'User details fetched successfully',
            payload: user,
        });
    } catch (error) {
        console.error('[getUser] Error:', error);
        return sendError(res, 400, {
            i18n: 'user.fetch_error',
            message: 'Error fetching user details',
        });
    }
};

export const updateUserPassword = async (req: Request, res: Response) => {
    try {
        const { id } = (req as AuthenticatedRequest).user;
        const { password, newPassword } = req.body;

        if (!password) {
            return sendError(res, 400, {
                i18n: 'user.no_current_password',
                message: 'No current password provided',
            });
        }

        if (!newPassword) {
            return sendError(res, 400, {
                i18n: 'user.no_new_password',
                message: 'No new password provided',
            });
        }

        const oldUser = await User.findById(id);
        if (!oldUser) {
            return sendError(res, 404, {
                i18n: 'user.not_found',
                message: 'User not found',
            });
        }

        const validPassword = await verifyPassword(password, oldUser.password);
        if (!validPassword) {
            return sendError(res, 401, {
                i18n: 'user.incorrect_password',
                message: 'Incorrect password',
            });
        }

        const passwordValidation = validatePassword(newPassword);
        if (!passwordValidation.valid) {
            return sendError(res, 400, {
                i18n: 'user.invalid_new_password',
                message: 'New password is invalid',
                errors: passwordValidation.errors,
            });
        }

        const hashedPassword = await hashPassword(newPassword);

        await User.findByIdAndUpdate(id, { password: hashedPassword }, { new: true });

        res.clearCookie('token', {
            httpOnly: true,
            secure: Boolean(process.env.IS_PRODUCTION),
            sameSite: 'strict',
            domain: process.env.COOKIE_DOMAIN,
        });

        return sendSuccess(res, 200, {
            i18n: 'user.password_updated',
            message: 'Password updated successfully',
        });
    } catch (error) {
        console.error('[updateUserPassword] Error:', error);
        return sendError(res, 500, {
            i18n: 'user.update_password_error',
            message: 'An unexpected error occurred while updating the password.',
        });
    }
};

// Register User
export const registerUser = async (req: Request, res: Response) => {
    try {
        const { email, nickname, password } = req.body;

        const emailValidation = validateEmail(email);
        if (!emailValidation.valid) {
            return sendError(res, 400, {
                i18n: 'user.invalid_email',
                message: emailValidation.message,
            });
        }

        const userDuplicated = await User.findOne({ email });
        if (userDuplicated) {
            return sendError(res, 400, {
                i18n: 'user.duplicate_email',
                message: 'User already exists',
            });
        }

        const nicknameValidation = validateNickname(nickname);
        if (!nicknameValidation.valid) {
            return sendError(res, 400, {
                i18n: 'user.invalid_nickname',
                message: nicknameValidation.message,
            });
        }

        const passwordValidation = validatePassword(password);
        if (!passwordValidation.valid) {
            return sendError(res, 400, {
                i18n: 'user.invalid_password',
                message: 'Password is invalid',
                errors: passwordValidation.errors,
            });
        }

        const newUser = new User({ email, nickname, password });
        const user = await newUser.save();

        const token = jwt.sign({ id: user._id }, process.env.EMAIL_CONFIRMATION_SECRET!, {
            expiresIn: '15m',
        });

        const { data, error } = await sendConfirmationEmail(email, token);

        if (error) {
            return sendError(res, 400, {
                i18n: 'user.email_error',
                message: error.message,
                errors: {
                    payload: data,
                },
            });
        }

        return sendSuccess(res, 200, {
            i18n: 'user.confirmation_email_sent',
            message: 'Confirmation email sent. Please check your inbox.',
        });
    } catch (err: any) {
        console.error('[registerUser] Error:', err);
        return handleMongooseError(err, res);
    }
};

// Confirm Email Endpoint
export const confirmEmail = async (req: Request, res: Response) => {
    try {
        const { token } = req.body;

        if (token == null || !token) {
            return sendError(res, 400, {
                i18n: 'user.missing_token',
                message: 'Missing token',
            });
        }

        const decoded = jwt.verify(token, process.env.EMAIL_CONFIRMATION_SECRET!) as TokenPayload;

        const user = await User.findById(decoded.id);
        if (!user || user.status !== 'pending') {
            return sendError(res, 400, {
                i18n: 'user.invalid_token',
                message: 'Token is invalid or already confirmed',
            });
        }

        user.status = 'active';

        await User.findByIdAndUpdate(user.id, { status: 'active' }, { new: true });

        return sendSuccess(res, 200, {
            i18n: 'user.email_confirmed',
            message: 'Email confirmed. Your account is now active.',
        });
    } catch (err) {
        console.error('[confirmEmail] Error:', err);
        return sendError(res, 500, {
            i18n: 'user.email_confirmation_error',
            message: 'Something went wrong while confirming the email.',
        });
    }
};

// Resend Confirmation Email Endpoint
export const resendConfirmationEmail = async (req: Request, res: Response) => {
    const { email } = req.body;

    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
        return sendError(res, 400, {
            i18n: 'user.invalid_email',
            message: emailValidation.message,
        });
    }

    try {
        const user = await User.findOne({ email });

        if (!user || user.status === 'active') {
            return sendError(res, 400, {
                i18n: 'user.already_confirmed',
                message: 'User already confirmed or does not exist.',
            });
        }

        const token = jwt.sign({ id: user._id }, process.env.EMAIL_CONFIRMATION_SECRET!, { expiresIn: '15m' });

        const { data, error } = await sendConfirmationEmail(email, token);

        if (error) {
            return sendError(res, 400, {
                i18n: 'user.email_error',
                message: error.message,
                errors: {
                    payload: data,
                },
            });
        }

        return sendSuccess(res, 200, {
            i18n: 'user.confirmation_email_resent',
            message: 'Confirmation email has been resent. Please check your inbox.',
        });
    } catch (err) {
        console.error('[resendConfirmationEmail] Error:', err);
        return sendError(res, 500, {
            i18n: 'user.email_confirmation_error',
            message: 'Error resending confirmation email.',
        });
    }
};
