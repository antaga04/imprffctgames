import axios from 'axios';

export const uploadScore = async (scoreData: unknown, gameId: string) => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/scores/`,
            {
                scoreData,
                game_id: gameId,
            },
            {
                withCredentials: true, // Include cookies in the request
            },
        );
        return response;
    } catch (error) {
        console.error('Error uploading score:', error);
        throw error;
    }
};
