import BackButton from '@/components/ui/BackButton';
import { useTranslation } from 'react-i18next';

const LizardType = () => {
    const { t } = useTranslation();
    return (
        <>
            <BackButton />

            <div className="min-h-screen flex flex-col justify-center items-center">
                <h1 className="text-4xl font-bold text-center neon-text text-white mb-4">
                    {t('games.lizardtype.name')}
                </h1>
                <p>{t('globals.available_soon')}</p>
            </div>
        </>
    );
};

export default LizardType;
