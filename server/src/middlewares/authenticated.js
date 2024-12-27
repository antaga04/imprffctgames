import { verifytoken } from '../utils/jwt.js';
import User from '../api/models/user.js';

export const hasValidAuthJwt = (req, res, next) => {
    try {
        const { authorization } = req.headers;
        const [, token] = authorization.split(' ');
        const payload = verifytoken(token);

        req.user = payload;

        next();
    } catch (err) {
        res.status(401).json({ error: 'Not authenticated' });
    }
};

export const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (user.rol === 'admin') {
            next();
        } else {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
