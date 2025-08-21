import { useAuth } from './useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { handleScoreUpload } from '@/lib/scoreHandler';
import { useTempScore } from './useTempScore';

export const useGameCompletion = (gameId: string | undefined, slug: string) => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { clearTempScore } = useTempScore();

    const handleCompletion = async (scoreData: ScoreData) => {
        if (!gameId || gameId.length === 0) return toast.error('Game ID is empty');

        if (isAuthenticated) {
            try {
                await handleScoreUpload({
                    scoreData,
                    gameId,
                    slug,
                });
                clearTempScore();
            } catch (error) {
                const err = error as MyError;

                if (err?.response?.status === 401) {
                    toast.warning('Session expired. Please log in to upload your score.', {
                        action: {
                            label: 'Login',
                            onClick: () => navigate('/login'),
                        },
                    });
                } else {
                    console.error('Error uploading score: ', error);
                    toast.error(err?.response?.data?.message || 'Error uploading score.');
                }
            }
        } else {
            toast.info('Login to upload score', {
                action: {
                    label: 'Login',
                    onClick: () => navigate('/login'),
                },
            });
        }
    };

    return handleCompletion;
};
