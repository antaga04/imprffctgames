import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@/utils/response';
import { AuthenticatedRequest } from '@/types/types';
import jwt from 'jsonwebtoken';
import { sendAccountDeletionEmail } from '@/utils/email';
import User from '../models/user';

export const requestAccountDeletion = async (req: Request, res: Response) => {
    try {
        const { id } = (req as AuthenticatedRequest).user;

        const user = await User.findById(id);

        if (!user || user.status === 'active') {
            return sendError(res, 400, {
                i18n: 'user.not_found',
                message: 'The user is not found or is not active.',
            });
        }

        const token = jwt.sign({ id: user._id }, process.env.DELETE_ACCOUNT_SECRET!, { expiresIn: '15m' });

        const { data, error } = await sendAccountDeletionEmail(user.email, token);

        if (error) {
            return sendError(res, 400, {
                i18n: 'user.email_delete_error',
                message: error.message,
                errors: {
                    payload: data,
                },
            });
        }

        return sendSuccess(res, 200, {
            i18n: 'user.account_deletion_requested',
            message: 'Account deletion requested successfully.',
        });
    } catch (err) {
        console.error('[requestAccountDeletion] Error:', err);
        return sendError(res, 500, {
            i18n: 'user.account_deletion_error',
            message: 'Something went wrong while requesting the account deletion.',
        });
    }
};

export const deleteAccount = async (req: Request, res: Response) => {
    try {
        const { token } = req.body;
        const { id } = (req as AuthenticatedRequest).user;

        const decoded = jwt.verify(token, process.env.DELETE_ACCOUNT_SECRET!) as { id: string };
        if (decoded.id !== id) {
            return sendError(res, 403, {
                i18n: 'user.account_deletion_forbidden',
                message: 'You are not allowed to delete this account.',
            });
        }

        await User.findByIdAndDelete(id);

        return sendSuccess(res, 200, {
            i18n: 'user.account_deleted',
            message: 'Account deleted successfully.',
        });
    } catch (err) {
        console.error('[deleteAccount] Error:', err);
        return sendError(res, 500, {
            i18n: 'user.account_deletion_error',
            message: 'Something went wrong while deleting the account.',
        });
    }
};
