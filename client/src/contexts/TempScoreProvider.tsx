import React, { createContext, useState } from 'react';

const TempScoreContext = createContext<TempScoreContextType | undefined>(undefined);

export const TempScoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [tempScore, setTempScoreState] = useState<TempScoreData | undefined>();

    const setTempScore = (data: TempScoreData) => setTempScoreState(data);
    const clearTempScore = () => setTempScoreState(undefined);

    return (
        <TempScoreContext.Provider value={{ tempScore, setTempScore, clearTempScore }}>
            {children}
        </TempScoreContext.Provider>
    );
};

export { TempScoreContext };
