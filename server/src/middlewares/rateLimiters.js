import { createRateLimiter } from '../utils/rateLimiters.js';

export const generalLimiter = createRateLimiter({
    windowMs: 3 * 60 * 1000,
    limit: 5,
    message: 'Too many requests, please wait before trying again.',
});

export const registerLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    message: 'Too many registration attempts. Please wait 15 minutes before trying again.',
});

export const resendConfirmationLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    limit: 2,
    message: 'Too many resend attempts. Please wait before trying again.',
});

export const avatarLimiter = createRateLimiter({
    windowMs: 1 * 60 * 60 * 1000,
    limit: 5,
    message: 'Too many avatar changes, please slow down.',
});
