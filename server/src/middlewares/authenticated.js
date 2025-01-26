import { verifytoken } from '../utils/jwt.js';
import User from '../api/models/user.js';

export const hasValidAuthJwt = (req, res, next) => {
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

export const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (user.role === 'admin') {
            next();
        } else {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
