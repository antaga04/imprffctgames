import { createRateLimiter } from '@/utils/rateLimiters';

export const generalLimiter = createRateLimiter({
    windowMs: 3 * 60 * 1000,
    limit: 50,
    message: 'Too many requests, please wait before trying again.',
    i18n: 'rate_limit_exceeded',
});

export const registerLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    message: 'Too many registration attempts. Please wait 15 minutes before trying again.',
    i18n: 'rate_limit_exceeded',
});

export const resendConfirmationLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    limit: 2,
    message: 'Too many resend attempts. Please wait before trying again.',
    i18n: 'rate_limit_exceeded',
});

export const avatarLimiter = createRateLimiter({
    windowMs: 1 * 60 * 60 * 1000,
    limit: 5,
    message: 'Too many avatar changes, please slow down.',
    i18n: 'rate_limit_exceeded',
});

export const requestPasswordResetLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    limit: 2,
    message: 'Too many password reset requests. Please wait before trying again.',
    i18n: 'rate_limit_exceeded',
});

export const resetPasswordLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    limit: 2,
    message: 'Too many password reset attempts. Please wait before trying again.',
    i18n: 'rate_limit_exceeded',
});

export const helloWorldLimiter = createRateLimiter({
    windowMs: 1 * 60 * 1000, // 1 minute
    limit: 1,
    message: 'Too many hello world requests. Please wait before trying again.',
    i18n: 'rate_limit_exceeded',
});

export const requestAccountDeletionLimiter = createRateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    limit: 2,
    message: 'Too many account deletion requests. Please wait before trying again.',
    i18n: 'rate_limit_exceeded',
});
