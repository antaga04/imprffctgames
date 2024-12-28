import axios from 'axios';

export const uploadScore = async (scoreData: unknown, gameId: string) => {
    try {
        const token = localStorage.getItem('jwt');

        const response = await axios.post(
            'http://localhost:8000/api/scores/',
            {
                scoreData,
                game_id: gameId,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );
        return response.data;
    } catch (error) {
        console.error('Error uploading score:', error);
        throw new Error('Failed to upload score');
    }
};
