import { useAuth } from './useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { handleScoreUpload } from '@/lib/scoreHandler';
import { useTempScore } from './useTempScore';
import { useTranslation } from 'react-i18next';
import { scoreFormatter } from '@/lib/gameUtils';

export const useGameCompletion = (gameId: string | undefined, slug: string) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { clearTempScore } = useTempScore();

    const handleCompletion = async (scoreData: ScoreData) => {
        if (!gameId || gameId.length === 0) return toast.error(t('scores.empty_game'));

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
                    toast.warning(t('scores.session_expired'), {
                        action: {
                            label: t('globals.login'),
                            onClick: () => navigate('/login'),
                        },
                    });
                } else if (err.response?.status === 409) {
                    const message = t(`server.${err.response.data?.i18n}`) ?? t('scores.not_uploaded');
                    const payload = err.response.data?.payload;
                    toast.warning(`${message}. ${t('scores.previous_score')}: ${scoreFormatter(payload.scoreData)}`);
                } else {
                    console.error('Error uploading score: ', error);
                    toast.error(t(`server.${err?.response?.data?.i18n}`) || t('scores.error'));
                }
            }
        } else {
            toast.info(t('scores.login_to_upload'), {
                action: {
                    label: t('globals.login'),
                    onClick: () => navigate('/login'),
                },
            });
        }
    };

    return handleCompletion;
};
