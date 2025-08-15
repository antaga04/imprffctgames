import mongoose from 'mongoose';
import { Response } from 'express';
import { sendError } from './response';

export const handleMongooseError = (err: any, res: Response) => {
    if (err instanceof mongoose.Error.ValidationError) {
        const messages = Object.values(err.errors).map((e) => e.message);
        return sendError(res, 400, {
            i18n: 'server.error.validation',
            message: messages.join(', '),
        });
    }

    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return sendError(res, 400, {
            i18n: 'server.error.duplicate',
            message: `${field} is already in use.`,
        });
    }

    console.error('Unexpected error:', err);
    return sendError(res, 500, {
        i18n: 'server.error.unexpected',
        message: 'Unexpected error occurred',
    });
};
