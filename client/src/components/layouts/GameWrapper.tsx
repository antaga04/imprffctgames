import React from 'react';
import BackButton from '@/components/ui/BackButton';

const GameWrapper: React.FC<GameWrapperProps> = ({ children, title, height, instructions }) => {
    return (
        <>
            <BackButton />
            <div className={`flex flex-col justify-start items-center min-h-[${height}] md:mt-40 mt-24`}>
                <h1 className="text-4xl font-bold text-center neon-text text-white mb-4">{title}</h1>
                {children}
                <p className="mt-4 text-center">{instructions}</p>
            </div>
        </>
    );
};

export default GameWrapper;
