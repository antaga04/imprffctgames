import React from 'react';
import BackButton from '@/components/ui/BackButton';
import { Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const GameWrapper: React.FC<GameWrapperProps> = ({ children, title, height, instructions }) => {
    const { t } = useTranslation();
    return (
        <>
            <BackButton />
            <div className={`flex flex-col justify-start items-center min-h-[${height}] md:mt-40 mt-24`}>
                <h1 className="text-4xl font-bold text-center neon-text text-white mb-4">{title}</h1>
                {children}
                <p className="flex gap-2 mt-4 mb-8 text-center flex-wrap justify-center">
                    <Info /> {instructions ?? t('games.loading_instructions') + '...'}
                </p>
            </div>
        </>
    );
};

export default GameWrapper;
