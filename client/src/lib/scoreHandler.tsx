import axios from 'axios';
import { toast } from 'sonner';
import { MedalIcon } from 'lucide-react';
import { GAMES } from './constants';

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
        const { message, data } = response.data;

        // Game-specific formatters
        const game = GAMES.find((game) => game.gameId === gameId);
        if (!game) return; // If the game doesn't exist, don't proceed

        const previousScoreFormatter = (data: ScoreData) => {
            switch (game.gameName) {
                case 'Pokemon':
                    return `${data.correct}/${data.total}`;
                case '15 Puzzle':
                    return `Moves: ${data.moves}, Time: ${data.time}`;
                default:
                    return JSON.stringify(data); // Fallback
            }
        };

        const newScoreDescription = (data: ScoreData) => {
            switch (game.gameName) {
                case 'Pokemon':
                    return `${data.correct}/${data.total}`;
                case '15 Puzzle':
                    return `Moves: ${data.moves}, Time: ${data.time}`;
                default:
                    return JSON.stringify(data); // Fallback
            }
        };

        if (response.status === 200) {
            toast.warning(`${message}. Previous score: ${previousScoreFormatter(data.scoreData)}`);
        } else if (response.status === 201) {
            toast(
                <>
                    <MedalIcon className="mr-4" />
                    <div className="flex flex-col">
                        <h2 className="text-base font-bold">{message}</h2>
                        <p className="text-sm">New score: {newScoreDescription(data.scoreData)}</p>
                    </div>
                </>,
                {
                    className: 'bg-[var(--blueish)] text-[var(--blue)] shadow-lg border border-[var(--blue)]',
                    duration: 5000,
                },
            );
        } else {
            toast.error(response.data.error);
        }
    } catch (error) {
        console.error('Error uploading score: ', error);
        toast.dismiss(loadingToastId);

        throw error;
    }
};
