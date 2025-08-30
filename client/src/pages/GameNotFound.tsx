import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const GameNotFound = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
            <div className="text-center mb-6">
                <div className="text-6xl mb-4">🤷‍♂️</div>

                <h1 className="text-4xl font-bold neon-text text-white mb-2">{t('games.not_found.title')}</h1>
                <p className="text-lg text-slate-300">{t('games.not_found.p1')}</p>
            </div>

            <button
                onClick={() => navigate('/')}
                className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700"
            >
                {t('globals.back_home')}
            </button>
        </div>
    );
};

export default GameNotFound;
