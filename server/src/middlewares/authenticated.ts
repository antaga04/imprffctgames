import { verifytoken } from '@/utils/jwt';
import User from '@/api/models/user';
import { Request, Response, NextFunction } from 'express';

export const hasValidAuthJwt = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.token; // Get token from cookies

        if (!token) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const payload = verifytoken(token); // Verify and decode the token
        req.user = payload;

        next();
    } catch (err) {
        res.status(401).json({ error: 'Not authenticated' });
    }
};

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        const user = await User.findById(req.user.id);
        if (user && user.role === 'admin') {
            next();
        } else {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
