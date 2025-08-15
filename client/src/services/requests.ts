import axios from 'axios';

export const verifyEmail = async (token: string) => {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/verify`, {
        token,
    });
    return response.data.message;
};
