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

export const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
    if (password == null || !password || typeof password !== 'string' || !passwordRegex.test(password)) {
        return {
            valid: false,
            message:
                'Password must be at least 6 characters long, contain at least one uppercase letter, one lowercase, one digit and one special character.',
        };
    }
    return { valid: true };
};

export const runValidations = (
    fields: [string, ReturnType<typeof validateEmail | typeof validatePassword | typeof validateNickname>][],
) => {
    for (const [field, result] of fields) {
        if (!result.valid) {
            return { valid: false, message: `${field}: ${result.message}` };
        }
    }
    return { valid: true };
};
