import axios from 'axios';
import i18next from 'i18next';

export const verifyEmail = async (token: string) => {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/verify`, {
        token,
    });
    return i18next.t(`server.${response.data.i18n}`);
};
