import { AtSymbolIcon, KeyIcon, RegisterUserIcon } from '@/icons';

export const LOGIN_INPUTS = [
    {
        label: 'Email',
        name: 'email',
        type: 'email',
        placeholder: 'Enter your email',
        icon: AtSymbolIcon,
    },
    {
        label: 'Password',
        name: 'password',
        type: 'password',
        placeholder: 'Enter your password',
        icon: KeyIcon,
    },
];

export const REGISTER_INPUTS = [
    {
        label: 'Nickname',
        name: 'nickname',
        type: 'text',
        placeholder: 'Enter a nickname',
        icon: RegisterUserIcon,
    },
    {
        label: 'Email',
        name: 'email',
        type: 'email',
        placeholder: 'Enter an email',
        icon: AtSymbolIcon,
    },
    {
        label: 'Password',
        name: 'password',
        type: 'password',
        placeholder: 'Enter a password',
        icon: KeyIcon,
    },
    {
        label: 'Confirm password',
        name: 'confirmPassword',
        type: 'password',
        placeholder: 'Confirm your password',
        icon: KeyIcon,
    },
];
