import { AtSign, KeyRound, User } from 'lucide-react';

export const GAMES: Game[] = [
    { gameId: import.meta.env.VITE_POKEMON_ID, gameName: 'Pokemon' },
    { gameId: import.meta.env.VITE_PUZZLE15_ID, gameName: '15 Puzzle' },
];

const EMAIL_INPUT = {
    label: 'Email',
    name: 'email',
    type: 'email',
    placeholder: 'Enter an email',
    Icon: AtSign,
};

const PASSWORD_INPUT = {
    label: 'Password',
    name: 'password',
    type: 'password',
    placeholder: 'Enter your password',
    Icon: KeyRound,
};

const CONFIRM_PASSWORD_INPUT = {
    label: 'Confirm password',
    name: 'confirmPassword',
    type: 'password',
    placeholder: 'Confirm your password',
    Icon: KeyRound,
};

const CURRENT_PASSWORD_INPUT = {
    label: 'Current password',
    name: 'currentPassword',
    type: 'password',
    placeholder: 'Enter your current password',
    Icon: KeyRound,
};

const NEW_PASSWORD_INPUT = {
    label: 'New password',
    name: 'newPassword',
    type: 'password',
    placeholder: 'Enter your new password',
    Icon: KeyRound,
};

const NICKNAME_INPUT = {
    label: 'Nickname',
    name: 'nickname',
    type: 'text',
    placeholder: 'Enter a nickname',
    Icon: User,
};

export const LOGIN_INPUTS = [EMAIL_INPUT, PASSWORD_INPUT];

export const REGISTER_INPUTS = [NICKNAME_INPUT, EMAIL_INPUT, PASSWORD_INPUT, CONFIRM_PASSWORD_INPUT];

export const ACCOUNT_INPUTS = [EMAIL_INPUT, NICKNAME_INPUT];

export const PASSWORD_INPUTS = [CURRENT_PASSWORD_INPUT, NEW_PASSWORD_INPUT, CONFIRM_PASSWORD_INPUT];
