import mongoose from 'mongoose';
import { Response } from 'express';

export const handleMongooseError = (err: any, res: Response) => {
    if (err instanceof mongoose.Error.ValidationError) {
        const messages = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json({ error: messages.join(', ') });
    }

    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(400).json({ error: `${field} is already in use.` });
    }

    console.error('Unexpected error:', err);
    return res.status(500).json({ error: 'Something went wrong' });
};
