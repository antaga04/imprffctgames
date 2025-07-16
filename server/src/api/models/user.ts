import mongoose from 'mongoose';
import { hashPassword } from '@/utils/password';
import { UserSchema } from '@/types/model';

const userSchema = new mongoose.Schema<UserSchema>({
    nickname: {
        type: String,
        required: [true, 'Nickname is required'],
        unique: true,
        minlength: [3, 'Nickname must be at least 3 characters long'],
        maxlength: [15, 'Nickname must be at most 15 characters long'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    password: { type: String, required: [true, 'Password is required'] },
    avatar: { type: String },
    scores: [{ type: mongoose.Types.ObjectId, ref: 'Score' }],
    role: { type: String, enum: { values: ['user', 'admin'] } },
    status: { type: String, enum: { values: ['pending', 'active', 'banned'] }, default: 'pending' },
    strikes: { type: Number, default: 0 },
});

userSchema.pre('save', async function () {
    this.password = await hashPassword(this.password);
    this.email = this.email.toLowerCase();
    this.role = 'user';
});

const User = mongoose.model<UserSchema>('User', userSchema, 'User');

export default User;
