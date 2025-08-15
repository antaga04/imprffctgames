import axios from 'axios';
import { toast } from 'sonner';
import { MedalIcon } from 'lucide-react';
import { GAMES } from './constants';
import { scoreFormatter } from './gameUtils';

interface ScoreUploadOptions {
    scoreData: unknown;
    gameId: string;
}

export const handleScoreUpload = async ({ scoreData, gameId }: ScoreUploadOptions) => {
    const loadingToastId = toast.loading('Uploading score...');
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/scores/`,
            {
                score: {
                    scoreData,
                    game_id: gameId,
                },
            },
            { withCredentials: true },
        );

        toast.dismiss(loadingToastId);
        const { message, payload } = response.data;

        // Game-specific formatters
        const game = GAMES.find((game) => game.gameId === gameId);
        if (!game) return; // If the game doesn't exist, don't proceed

        if (response.status === 200) {
            toast.warning(`${message}. Previous score: ${scoreFormatter(payload.scoreData, game)}`);
        } else if (response.status === 201) {
            toast(
                <>
                    <MedalIcon className="mr-4" />
                    <div className="flex flex-col">
                        <h2 className="text-base font-bold">{message}</h2>
                        <p className="text-sm">New score: {scoreFormatter(payload.scoreData, game)}</p>
                    </div>
                </>,
                {
                    className: 'bg-[var(--blueish)] text-[var(--blue)] shadow-lg border border-[var(--blue)]',
                    duration: 5000,
                },
            );
        } else {
            toast.error(response.data.message || 'Score upload failed');
        }
    } catch (error) {
        console.error('Error uploading score: ', error);
        toast.dismiss(loadingToastId);

        throw error;
    }
};
