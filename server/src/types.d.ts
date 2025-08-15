import { Request } from 'express';

type TokenPayload = {
    id: string;
};

interface AuthenticatedRequest extends Request {
    user: TokenPayload;
}

interface ApiSuccess<T> {
    success: true;
    i18n: string;
    message: string;
    payload?: T;
}

interface ApiError<T> {
    success: false;
    i18n: string;
    message: string;
    error?: Record<string, T>;
}

type ApiResponse<T = any> = ApiSuccess<T> | ApiError<T>;

type PasswordValidationResult =
    | { valid: true }
    | { valid: false; errors: Partial<Record<PasswordValidationErrorKey, string>> };

type PasswordValidationErrorKey = 'length' | 'lowercase' | 'uppercase' | 'digit' | 'specialChar' | 'general';

//! Example: Extend Express Request

declare module 'express' {
    interface Request {
        user?: {
            id: string;
        };
    }
}
