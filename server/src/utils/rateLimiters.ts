import { Request } from 'express';
import crypto from 'crypto';
import rateLimit from 'express-rate-limit';
import requestIp from 'request-ip';
import { verifytoken } from '@/utils/jwt';
import { sendError } from './response';

// Generate a fingerprint for unauthenticated users
const generateFingerprint = (req: Request) => {
    const ip = requestIp.getClientIp(req) || 'unknown_ip';
    const userAgent = req.headers['user-agent'] || 'unknown_agent';
    const acceptLanguage = req.headers['accept-language'] || 'unknown_lang';

    return crypto.createHash('sha256').update(`${ip}-${userAgent}-${acceptLanguage}`).digest('hex');
};

// Helper to get identifier (User ID or Fingerprint)
const getUserIdentifier = async (req: Request) => {
    if (req.cookies?.token) {
        try {
            const decoded = verifytoken(req.cookies.token);
            return `USER-${decoded.id}`;
        } catch (error) {}
    }

    return `GUEST-${generateFingerprint(req)}`;
};

// Factory function to create multiple rate limiters
export const createRateLimiter = (options: { windowMs: number; limit: number; message: string }) => {
    return rateLimit({
        windowMs: options.windowMs,
        limit: options.limit,
        keyGenerator: async (req) => await getUserIdentifier(req),
        handler: (req, res) => {
            sendError(res, 429, {
                i18n: 'rate_limit_exceeded',
                message: options.message,
            });
        },
        standardHeaders: false,
        legacyHeaders: false,
    });
};
