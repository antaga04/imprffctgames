/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useState, useEffect } from 'react';

type TempScoreData = {
    scoreData: ScoreData;
    gameId: string;
};

type TempScoreContextType = {
    tempScore?: TempScoreData;
    setTempScore: (data: TempScoreData) => void;
    clearTempScore: () => void;
};

const TempScoreContext = createContext<TempScoreContextType | undefined>(undefined);

export const TempScoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [tempScore, setTempScoreState] = useState<TempScoreData | undefined>(undefined);

    // Initialize BroadcastChannel for communication between tabs
    const channel = new BroadcastChannel('tempScoreChannel');

    // Listen for messages (tempScore updates) from other tabs
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data.type === 'updateTempScore') {
                setTempScoreState(event.data.tempScore);
            }
        };

        channel.addEventListener('message', handleMessage);

        // Cleanup on unmount
        return () => {
            channel.removeEventListener('message', handleMessage);
            channel.close();
        };
    }, []);

    // Function to set tempScore and broadcast it to other tabs
    const setTempScore = (data: TempScoreData) => {
        setTempScoreState(data);
        // Broadcast the tempScore to other tabs
        channel.postMessage({ type: 'updateTempScore', tempScore: data });
    };

    // Function to clear tempScore and broadcast it to other tabs
    const clearTempScore = () => {
        setTempScoreState(undefined);
        // Broadcast the clear signal to other tabs
        channel.postMessage({ type: 'clearTempScore' });
    };

    return (
        <TempScoreContext.Provider value={{ tempScore, setTempScore, clearTempScore }}>
            {children}
        </TempScoreContext.Provider>
    );
};

export { TempScoreContext };
