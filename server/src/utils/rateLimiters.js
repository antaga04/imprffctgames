import rateLimit from 'express-rate-limit';

export const generalLimiter = rateLimit({
    windowMs: 3 * 60 * 1000,
    limit: 50,
    standardHeaders: false,
    legacyHeaders: false,
});

export const registerLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 2,
    message: 'Too many registration attempts. Please wait 15 minutes before trying again.',
    standardHeaders: false,
    legacyHeaders: false,
});

export const resendConfirmationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 1,
    message: 'Too many resend attempts. Please wait before trying again.',
});

export const avatarLimiter = rateLimit({
    windowMs: 1 * 60 * 60 * 1000,
    limit: 5,
    message: 'Too many avatar changes, please slow down.',
    standardHeaders: false,
    legacyHeaders: false,
});
