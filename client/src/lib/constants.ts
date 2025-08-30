import { AtSign, KeyRound, User } from 'lucide-react';

export const PUZZLE15_SLUG = 'puzzle15';
export const POKEMON_SLUG = 'pokemon';
export const TICTACTOE_SLUG = 'tictactoe';
export const LIZARDTYPE_SLUG = 'lizardtype';

export const EMAIL_INPUT = {
    label: 'constants.email_label',
    name: 'email',
    type: 'email',
    placeholder: 'constants.email_placeholder',
    Icon: AtSign,
};

const PASSWORD_INPUT = {
    label: 'constants.password_label',
    name: 'password',
    type: 'password',
    placeholder: 'constants.password_placeholder',
    Icon: KeyRound,
};

const CONFIRM_PASSWORD_INPUT = {
    label: 'constants.confirm_password_label',
    name: 'confirmPassword',
    type: 'password',
    placeholder: 'constants.confirm_password_placeholder',
    Icon: KeyRound,
};

const CURRENT_PASSWORD_INPUT = {
    label: 'constants.current_password_label',
    name: 'currentPassword',
    type: 'password',
    placeholder: 'constants.current_password_placeholder',
    Icon: KeyRound,
};

const NEW_PASSWORD_INPUT = {
    label: 'constants.new_password_label',
    name: 'newPassword',
    type: 'password',
    placeholder: 'constants.new_password_placeholder',
    Icon: KeyRound,
};

const NICKNAME_INPUT = {
    label: 'constants.nickname_label',
    name: 'nickname',
    type: 'text',
    placeholder: 'constants.nickname_placeholder',
    Icon: User,
};

export const LOGIN_INPUTS = [EMAIL_INPUT, PASSWORD_INPUT];

export const REGISTER_INPUTS = [NICKNAME_INPUT, EMAIL_INPUT, PASSWORD_INPUT, CONFIRM_PASSWORD_INPUT];

export const ACCOUNT_INPUTS = [EMAIL_INPUT, NICKNAME_INPUT];

export const PASSWORD_INPUTS = [CURRENT_PASSWORD_INPUT, NEW_PASSWORD_INPUT, CONFIRM_PASSWORD_INPUT];

export const RESET_PASSWORD_INPUTS = [NEW_PASSWORD_INPUT, CONFIRM_PASSWORD_INPUT];

export const UNIT_MAP: Record<string, string> = {
    time: 's',
    consistency: '%',
    moves: '', // no unit
    wpm: '', // no unit
};

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const LANGUAGES = [
    {
        label: 'English',
        value: 'en',
    },
    {
        label: 'Español',
        value: 'es',
    },
];
