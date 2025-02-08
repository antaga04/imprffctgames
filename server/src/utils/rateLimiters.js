import rateLimit from 'express-rate-limit';
import crypto from 'crypto';
import requestIp from 'request-ip';
import { verifytoken } from './jwt.js';

//* Generate a fingerprint for unauthenticated users
const generateFingerprint = (req) => {
    const ip = requestIp.getClientIp(req) || 'unknown_ip';
    const userAgent = req.headers['user-agent'] || 'unknown_agent';
    const acceptLanguage = req.headers['accept-language'] || 'unknown_lang';

    return crypto.createHash('sha256').update(`${ip}-${userAgent}-${acceptLanguage}`).digest('hex');
};

//* Helper to get identifier (User ID or Fingerprint)
const getUserIdentifier = async (req) => {
    if (req.cookies?.token) {
        try {
            const decoded = verifytoken(req.cookies.token);
            return `USER-${decoded.id}`;
        } catch (error) {
            return null;
        }
    }

    return `GUEST-${generateFingerprint(req)}`;
};

//* Factory function to create multiple rate limiters
export const createRateLimiter = (options) => {
    return rateLimit({
        windowMs: options.windowMs,
        limit: options.limit,
        keyGenerator: async (req) => await getUserIdentifier(req),
        handler: (req, res) => {
            res.status(429).json({ message: options.message });
        },
        standardHeaders: false,
        legacyHeaders: false,
    });
};
