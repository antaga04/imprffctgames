import axios from 'axios';

const USERS_URL = import.meta.env.VITE_API_URL + '/users/';

export const updateAccount = async (data: { nickname: string }) => {
    return axios.put(USERS_URL, data, {
        withCredentials: true,
    });
};

export const updatePassword = async (data: { password: string; newPassword: string }) => {
    return axios.put(USERS_URL + 'newpassword', data, {
        withCredentials: true,
    });
};

export const fetchUserData = async () => {
    return axios.get(USERS_URL, {
        withCredentials: true,
    });
};
