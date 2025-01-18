import { useAuth } from './useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { handleScoreUpload } from '@/lib/scoreHandler';
import { AxiosError } from 'axios';
import { useTempScore } from './useTempScore';

export const useGameCompletion = (gameId: string) => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { clearTempScore } = useTempScore();

    const handleCompletion = async (scoreData: ScoreData) => {
        if (isAuthenticated) {
            try {
                await handleScoreUpload({
                    scoreData,
                    gameId,
                });
                clearTempScore();
            } catch (error) {
                const err = error as AxiosError;

                if (err?.response?.status === 401) {
                    toast.warning('Session expired. Please log in to upload your score.', {
                        action: {
                            label: 'Login',
                            onClick: () => navigate('/login'),
                        },
                    });
                } else {
                    console.error('Error uploading score: ', error);
                    toast.error('Error uploading score.');
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
