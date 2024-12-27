import mongoose from 'mongoose';
import { hashPassword } from '../../utils/password.js';

const userSchema = new mongoose.Schema({
    nickname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    avatar: { type: String },
    scores: [{ type: mongoose.Types.ObjectId, ref: 'Score' }],
    rol: { type: String, enum: ['user', 'admin'] },
});

userSchema.pre('save', async function () {
    this.password = await hashPassword(this.password);
    this.rol = 'user';
});

const User = mongoose.model('User', userSchema, 'User');

export default User;
