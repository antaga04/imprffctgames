import i18next from 'i18next';
import { EMAIL_REGEX } from './constants';

// Reusable validation rules
const validationRules = {
    minLength: (min: number): ValidationRule => ({
        test: (value: string) => value.length >= min,
        get message() {
            return i18next.t('validations.min_length', { min });
        },
    }),

    maxLength: (max: number): ValidationRule => ({
        test: (value: string) => value.length <= max,
        get message() {
            return i18next.t('validations.max_length', { max });
        },
    }),

    pattern: (regex: RegExp, key: string, options?: Record<string, unknown>): ValidationRule => ({
        test: (value: string) => regex.test(value),
        get message() {
            return i18next.t(key, options);
        },
    }),

    required: (): ValidationRule => ({
        test: (value: string) => Boolean(value?.trim()),
        get message() {
            return i18next.t('validations.required');
        },
    }),

    noSpaces: (): ValidationRule => ({
        test: (value: string) => !/\s/.test(value),
        get message() {
            return i18next.t('validations.no_spaces');
        },
    }),

    matches: (otherValue: string): ValidationRule => ({
        test: (value: string) => value === otherValue,
        get message() {
            return i18next.t('validations.matches');
        },
    }),

    mustHaveOriginal: (originalValue: string): ValidationRule => ({
        test: () => Boolean(originalValue?.trim()),
        get message() {
            return i18next.t('validations.must_have_original');
        },
    }),

    originalIsValid: (originalValue: string): ValidationRule => ({
        // Uses the current password value to check ALL password rules
        test: () => baseSchemas.password.rules.every((rule) => rule.test(originalValue)),
        get message() {
            return i18next.t('validations.original_is_valid');
        },
    }),
};

// Validation schemas
export const baseSchemas: Record<string, ValidationSchema> = {
    nickname: {
        get heading() {
            return i18next.t('validations.schema.nickname');
        },
        rules: [
            validationRules.minLength(3),
            validationRules.maxLength(15),
            validationRules.pattern(/^[a-zA-Z0-9_]+$/, 'validations.schema.only_contains'),
        ],
    },

    password: {
        get heading() {
            return i18next.t('validations.schema.password');
        },
        rules: [
            validationRules.minLength(8),
            validationRules.pattern(/[A-Z]/, 'validations.schema.uppercase'),
            validationRules.pattern(/[a-z]/, 'validations.schema.lowercase'),
            validationRules.pattern(/[0-9]/, 'validations.schema.number'),
            validationRules.pattern(/[^A-Za-z0-9\s]/, 'validations.schema.special_character'),
        ],
    },

    email: {
        get heading() {
            return i18next.t('validations.schema.email');
        },
        rules: [
            validationRules.required(),
            validationRules.noSpaces(),
            validationRules.pattern(EMAIL_REGEX, 'validations.schema.email_format'),
        ],
    },
};

export const validationSchemas: Record<string, ValidationSchema> = {
    ...baseSchemas,

    newPassword: {
        get heading() {
            return i18next.t('validations.schema.new_password');
        },
        rules: baseSchemas.password.rules,
    },

    // Confirm password - will be dynamically updated
    confirmPassword: {
        get heading() {
            return i18next.t('validations.schema.confirm_password');
        },
        rules: [],
    },

    currentPassword: {
        get heading() {
            return i18next.t('validations.schema.current_password');
        },
        rules: [validationRules.required()],
    },
};

// Generic validation function
export const validate = (value: string, schemaKey: string): ValidationResult => {
    const schema = validationSchemas[schemaKey];
    if (!schema) {
        throw new Error(`${i18next.t('validations.schema.unknown')}: ${schemaKey}`);
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
            get heading() {
                return i18next.t('validations.schema.confirm_password');
            },
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
        get heading() {
            return i18next.t('validations.schema.confirm_password');
        },
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
    currentPassword: (value) => [value.trim() ? '' : 'validations.required'].filter(Boolean),
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
