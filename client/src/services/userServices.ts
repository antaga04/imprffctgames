import axios from 'axios';
import i18next from 'i18next';

const USERS_URL = import.meta.env.VITE_API_URL + '/users';

export const updateAccount = async (data: { nickname: string }) => {
    return axios.put(USERS_URL, data, {
        withCredentials: true,
    });
};

export const updatePassword = async (data: { password: string; newPassword: string }) => {
    return axios.put(USERS_URL + '/newpassword', data, {
        withCredentials: true,
    });
};

export const fetchUserData = async () => {
    return axios.get(USERS_URL, {
        withCredentials: true,
    });
};

export const resetPassword = async (data: { token: string | null; password: string }) => {
    return axios.post(USERS_URL + '/reset-password', data, {
        withCredentials: true,
    });
};

export const requestPasswordReset = async (email: string) => {
    return axios.post(
        USERS_URL + '/request-password-reset',
        { email },
        {
            withCredentials: true,
        },
    );
};

export const requestAccountDeletion = async () => {
    return axios.get(USERS_URL + '/delete', {
        withCredentials: true,
    });
};

export const verifyEmail = async (token: string) => {
    const response = await axios.post(USERS_URL + '/confirm-email', {
        token,
    });
    return i18next.t(`server.${response.data.i18n}`);
};

export const resendEmail = async (email: string) => {
    return await axios.post(USERS_URL + '/resend-email', {
        email,
    });
};

export const deleteAccount = async (token: string) => {
    return await axios.delete(USERS_URL + '/delete', {
        withCredentials: true,
        data: { token },
    });
};
