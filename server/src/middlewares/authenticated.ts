import { verifytoken } from '@/utils/jwt';
import User from '@/api/models/user';
import { Request, Response, NextFunction } from 'express';
import { sendError } from '@/utils/response';

export const hasValidAuthJwt = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.token; // Get token from cookies

        if (!token) {
            return sendError(res, 401, {
                i18n: 'error.not_authenticated',
                message: 'Not authenticated',
            });
        }

        const payload = verifytoken(token); // Verify and decode the token
        req.user = payload;

        next();
    } catch (err) {
        console.error('[hasValidAuthJwt] Error');
        sendError(res, 401, {
            i18n: 'error.not_authenticated',
            message: 'Not authenticated',
        });
    }
};

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user || !req.user.id) {
            return sendError(res, 401, {
                i18n: 'error.not_authenticated',
                message: 'Not authenticated',
            });
        }
        const user = await User.findById(req.user.id);
        if (user && user.role === 'admin') {
            next();
        } else {
            return sendError(res, 403, {
                i18n: 'error.unauthorized',
                message: 'Unauthorized',
            });
        }
    } catch (err) {
        console.error('[isAdmin] Error');
        sendError(res, 500, {
            i18n: 'error.internal_server',
            message: 'Internal Server Error',
        });
    }
};
