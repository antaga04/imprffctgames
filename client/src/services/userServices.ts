import axios from 'axios';

const USERS_URL = import.meta.env.VITE_API_URL + '/users/';

export const updateAccount = async (data: { nickname: string; email: string }, token: string) => {
    return axios.put(USERS_URL, data, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const updatePassword = async (data: { password: string; newPassword: string }, token: string) => {
    return axios.put(USERS_URL + 'newpassword', data, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const fetchUserData = async (token: string) => {
    return axios.get(USERS_URL, {
        headers: { Authorization: `Bearer ${token}` },
    });
};
