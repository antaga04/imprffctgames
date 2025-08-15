import { PasswordValidationErrorKey, PasswordValidationResult } from '@/types';

const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const validateNickname = (nickname: string) => {
    if (nickname == null || !nickname || typeof nickname !== 'string' || nickname.trim().length < 3) {
        return { valid: false, message: 'Nickname must be at least 3 characters long and cannot be empty.' };
    }
    return { valid: true };
};

export const validateEmail = (email: string) => {
    if (email == null || !email || typeof email !== 'string' || !emailRegex.test(email)) {
        return { valid: false, message: 'Email is not valid or cannot be empty.' };
    }
    return { valid: true };
};

export const validatePassword = (password: string): PasswordValidationResult => {
    const errors: Partial<Record<PasswordValidationErrorKey, string>> = {};

    if (typeof password !== 'string' || password.trim() === '') {
        return {
            valid: false,
            errors: {
                general: 'password.invalid_type_or_empty',
            },
        };
    }

    if (password.length < 6) {
        errors.length = 'password.too_short';
    }

    if (!/[a-z]/.test(password)) {
        errors.lowercase = 'password.missing_lowercase';
    }

    if (!/[A-Z]/.test(password)) {
        errors.uppercase = 'password.missing_uppercase';
    }

    if (!/\d/.test(password)) {
        errors.digit = 'password.missing_digit';
    }

    if (!/[\W_]/.test(password)) {
        errors.specialChar = 'password.missing_special_char';
    }

    return Object.keys(errors).length > 0
        ? { valid: false, errors: errors as Record<PasswordValidationErrorKey, string> }
        : { valid: true };
};

export function validateRequiredFields(body: Record<string, any>, fields: string[]): Record<string, string> {
    const errors: Record<string, string> = {};
    fields.forEach((field) => {
        if (!body[field]) {
            errors[field] = `${field} is required`;
        }
    });
    return errors;
}
