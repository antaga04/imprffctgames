import { Request } from 'express';
import rateLimit from 'express-rate-limit';
import crypto from 'crypto';
import requestIp from 'request-ip';
import { verifytoken } from '@/utils/jwt';

//* Generate a fingerprint for unauthenticated users
const generateFingerprint = (req: Request) => {
    const ip = requestIp.getClientIp(req) || 'unknown_ip';
    const userAgent = req.headers['user-agent'] || 'unknown_agent';
    const acceptLanguage = req.headers['accept-language'] || 'unknown_lang';

    return crypto.createHash('sha256').update(`${ip}-${userAgent}-${acceptLanguage}`).digest('hex');
};

//* Helper to get identifier (User ID or Fingerprint)
const getUserIdentifier = async (req: Request) => {
    if (req.cookies?.token) {
        try {
            const decoded = verifytoken(req.cookies.token);
            return `USER-${decoded.id}`;
        } catch (error) {}
    }

    return `GUEST-${generateFingerprint(req)}`;
};

//* Factory function to create multiple rate limiters
export const createRateLimiter = (options: { windowMs: number; limit: number; message: string }) => {
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
