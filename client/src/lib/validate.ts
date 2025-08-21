import { EMAIL_REGEX } from './constants';

// Reusable validation rules
const validationRules = {
    minLength: (min: number): ValidationRule => ({
        test: (value: string) => value.length >= min,
        message: `Be at least ${min} characters.`,
    }),

    maxLength: (max: number): ValidationRule => ({
        test: (value: string) => value.length <= max,
        message: `Be at most ${max} characters.`,
    }),

    pattern: (regex: RegExp, message: string): ValidationRule => ({
        test: (value: string) => regex.test(value),
        message,
    }),

    required: (): ValidationRule => ({
        test: (value: string) => Boolean(value?.trim()),
        message: 'Is required.',
    }),

    noSpaces: (): ValidationRule => ({
        test: (value: string) => !/\s/.test(value),
        message: 'Cannot contain spaces.',
    }),

    matches: (otherValue: string): ValidationRule => ({
        test: (value: string) => value === otherValue,
        message: 'Passwords must match.',
    }),

    mustHaveOriginal: (originalValue: string): ValidationRule => ({
        test: () => Boolean(originalValue?.trim()),
        message: 'Set a password before confirming.',
    }),

    originalIsValid: (originalValue: string): ValidationRule => ({
        // Uses the current password value to check ALL password rules
        test: () => baseSchemas.password.rules.every((rule) => rule.test(originalValue)),
        message: 'Password does not meet requirements.',
    }),
};

// Validation schemas
export const baseSchemas: Record<string, ValidationSchema> = {
    nickname: {
        heading: 'Nickname must:',
        rules: [
            validationRules.minLength(3),
            validationRules.maxLength(15),
            validationRules.pattern(/^[a-zA-Z0-9_]+$/, 'Only contain letters, numbers, and underscores.'),
        ],
    },

    password: {
        heading: 'Password must:',
        rules: [
            validationRules.minLength(8),
            validationRules.pattern(/[A-Z]/, 'Contain at least one uppercase letter.'),
            validationRules.pattern(/[a-z]/, 'Contain at least one lowercase letter.'),
            validationRules.pattern(/[0-9]/, 'Contain at least one number.'),
            validationRules.pattern(/[!@#$%^&*]/, 'Contain at least one special character (!@#$%^&*).'),
        ],
    },

    email: {
        heading: 'Email:',
        rules: [
            validationRules.required(),
            validationRules.noSpaces(),
            validationRules.pattern(EMAIL_REGEX, 'Must be in the format name@example.com.'),
        ],
    },
};

export const validationSchemas: Record<string, ValidationSchema> = {
    ...baseSchemas,

    newPassword: {
        heading: 'New password must:',
        rules: baseSchemas.password.rules,
    },

    // Confirm password - will be dynamically updated
    confirmPassword: {
        heading: 'Confirm password must:',
        rules: [],
    },
};

// Generic validation function
export const validate = (value: string, schemaKey: string): ValidationResult => {
    const schema = validationSchemas[schemaKey];
    if (!schema) {
        throw new Error(`Unknown validation schema: ${schemaKey}`);
    }

    const errors = schema.rules.filter((rule) => !rule.test(value)).map((rule) => rule.message);

    return {
        isValid: errors.length === 0,
        errors,
    };
};

// Specialized validation functions (for backward compatibility)
export const validateNickname = (nickname: string): string[] => validate(nickname, 'nickname').errors;

export const validatePassword = (password: string): string[] => validate(password, 'password').errors;

export const validateEmail = (email: string): string[] => validate(email, 'email').errors;

export const getValidationSchema = (name: string, originalPassword?: string): ValidationSchema => {
    if (name === 'confirmPassword') {
        const pwd = originalPassword ?? '';
        return {
            heading: 'Confirm password must:',
            rules: [
                validationRules.required(),
                validationRules.mustHaveOriginal(pwd),
                validationRules.originalIsValid(pwd),
                validationRules.matches(pwd),
            ],
        };
    }

    return validationSchemas[name] || { heading: '', rules: [] };
};

export const validateConfirmPassword = (password: string, confirmPassword: string): string[] => {
    const schema: ValidationSchema = {
        heading: 'Confirm password must:',
        rules: [
            validationRules.required(),
            validationRules.mustHaveOriginal(password),
            validationRules.originalIsValid(password),
            validationRules.matches(password),
        ],
    };

    // Collect failed rule messages
    return schema.rules.filter((rule) => !rule.test(confirmPassword)).map((rule) => rule.message);
};

export const focusFirstInvalidField = (errors: Record<string, string[]>) => {
    const firstInvalidField = Object.keys(errors).find((key) => errors[key].length > 0);
    if (firstInvalidField) {
        const el = document.getElementsByName(firstInvalidField)[0] as HTMLInputElement;
        el?.focus();
    }
};

type ValidatorFn = (value: string, formData?: Record<string, string>) => string[];

export const fieldValidators: Record<string, ValidatorFn> = {
    nickname: (value) => validateNickname(value),
    email: (value) => validateEmail(value),
    password: (value) => validatePassword(value),
    newPassword: (value) => validatePassword(value),
    confirmPassword: (value, formData) =>
        validateConfirmPassword(formData?.newPassword ?? formData?.password ?? '', value),
    currentPassword: (value) => [value.trim() ? '' : 'Is required.'].filter(Boolean),
};

export const runValidations = <T extends Record<string, string>>(formData: T) => {
    const errors: Record<string, string[]> = {};

    for (const key in formData) {
        const validator = fieldValidators[key];
        if (validator) {
            errors[key] = validator(formData[key], formData);
        }
    }

    const allErrors = Object.values(errors).flat();
    return { errors, allErrors };
};
