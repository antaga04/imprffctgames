import axios from 'axios';
import { toast } from 'sonner';
import { MedalIcon } from 'lucide-react';
import { scoreFormatter } from './gameUtils';

interface ScoreUploadOptions {
    scoreData: unknown;
    gameId: string;
    slug: string;
}

export const handleScoreUpload = async ({ scoreData, gameId, slug }: ScoreUploadOptions) => {
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

        if (!slug) return; // If the game doesn't exist, don't proceed

        if (response.status === 201 || response.status === 200) {
            toast(
                <>
                    <MedalIcon className="mr-4" />
                    <div className="flex flex-col">
                        <h2 className="text-base font-bold">{message}</h2>
                        <p className="text-sm">New score: {scoreFormatter(payload.scoreData)}</p>
                    </div>
                </>,
                {
                    className: 'bg-[var(--blueish)] text-[var(--blue)] shadow-lg border border-[var(--blue)]',
                    duration: 5000,
                },
            );
        }
    } catch (error) {
        console.error('Error uploading score: ', error);

        const err = error as MyError;

        if (err.response?.status === 409) {
            const message = err.response.data?.message ?? 'Score not updated';
            const payload = err.response.data?.payload;
            toast.warning(`${message}. Previous score: ${scoreFormatter(payload.scoreData)}`);
        }

        toast.dismiss(loadingToastId);

        throw error;
    }
};
