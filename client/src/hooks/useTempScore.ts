import { useContext } from 'react';
import { TempScoreContext } from '@/contexts/TempScoreProvider';

export const useTempScore = () => {
    const context = useContext(TempScoreContext);
    if (!context) {
        throw new Error('useTempScore must be used within a TempScoreProvider');
    }
    return context;
};
