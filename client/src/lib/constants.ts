import { AtSign, KeyRound, User } from 'lucide-react';

export const LOGIN_INPUTS = [
    {
        label: 'Email',
        name: 'email',
        type: 'email',
        placeholder: 'Enter your email',
        icon: AtSign,
    },
    {
        label: 'Password',
        name: 'password',
        type: 'password',
        placeholder: 'Enter your password',
        icon: KeyRound,
    },
];

export const REGISTER_INPUTS = [
    {
        label: 'Nickname',
        name: 'nickname',
        type: 'text',
        placeholder: 'Enter a nickname',
        icon: User,
    },
    {
        label: 'Email',
        name: 'email',
        type: 'email',
        placeholder: 'Enter an email',
        icon: AtSign,
    },
    {
        label: 'Password',
        name: 'password',
        type: 'password',
        placeholder: 'Enter a password',
        icon: KeyRound,
    },
    {
        label: 'Confirm password',
        name: 'confirmPassword',
        type: 'password',
        placeholder: 'Confirm your password',
        icon: KeyRound,
    },
];
