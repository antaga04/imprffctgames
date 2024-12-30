import User from '../../api/models/user.js';
import { hashPassword, verifyPassword } from '../../utils/password.js';
import { signToken } from '../../utils/jwt.js';
import deleteCloudinaryImage from '../../utils/cloudinary.js';
import { validateNickname, validateEmail, validatePassword } from '../../utils/validation.js';

export const registerUser = async (req, res) => {
    try {
        const { email, nickname, password } = req.body;

        const userDuplicated = await User.findOne({ email: email });
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

        res.status(201).json({ data: user });
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: 'Error registering user' });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email })
            .populate({
                path: 'scores',
                populate: {
                    path: 'game_id',
                    select: 'name cover',
                },
            })
            .lean();

        if (!user) {
            res.status(401).json({ error: `User doesn't exist` });
            return;
        }

        const validPassword = await verifyPassword(password, user.password);

        if (!validPassword) {
            res.status(401).json({ error: `Incorrect email or password` });
            return;
        }

        const token = signToken({ id: user._id });
        const { password: unusedPassword, ...restUser } = user;
        res.status(200).json({ data: { token, user: restUser } });
    } catch (err) {
        res.status(400).json({ error: 'Error login' });
    }
};

export const updateUserAvatar = async (req, res) => {
    const { path } = req.file;
    const { id } = req.user;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.avatar) {
            await deleteCloudinaryImage(user.avatar);
        }

        await User.findByIdAndUpdate(id, { avatar: path }, { new: true });

        res.status(201).json({ data: path });
    } catch (error) {
        console.error('Error updating avatar:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.user;
        const { nickname, email, password } = req.body;

        // Fetch the existing user
        const oldUser = await User.findById(id);
        if (!oldUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Object to store fields to update
        const updateFields = {};

        // Validate and prepare fields for update
        if (nickname !== undefined) {
            const nicknameValidation = validateNickname(nickname);
            if (!nicknameValidation.valid) {
                return res.status(400).json({ error: nicknameValidation.message });
            }
            updateFields.nickname = nickname;
        }

        if (email !== undefined) {
            const emailValidation = validateEmail(email);
            if (!emailValidation.valid) {
                return res.status(400).json({ error: emailValidation.message });
            }
            updateFields.email = email;
        }

        if (password !== undefined) {
            const passwordValidation = validatePassword(password);
            if (!passwordValidation.valid) {
                return res.status(400).json({ error: passwordValidation.message });
            }
            // Consider hashing the password before saving
            const hashedPassword = await hashPassword(password);
            updateFields.password = hashedPassword;
        }

        // Ensure there are fields to update
        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ error: 'No valid fields provided for update.' });
        }

        // Update the user
        const updatedUser = await User.findByIdAndUpdate(id, updateFields, { new: true });

        return res.status(200).json({ data: updatedUser });
    } catch (error) {
        console.error('Error updating user:', error);
        return res.status(500).json({ error: 'An unexpected error occurred while updating the user.' });
    }
};

export const getUser = async (req, res) => {
    try {
        const { id } = req.user;

        const user = await User.findById(id).select('-password');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ data: user });
    } catch (error) {
        res.status(400).json({ error: 'Error fetching user details' });
    }
};
