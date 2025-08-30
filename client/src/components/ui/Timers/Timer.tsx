import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const Timer: React.FC<TimerIncrementProps> = ({ isRunning, gameStarted, resetSignal, onGameFinish }) => {
    const { t } = useTranslation();
    const [localTime, setLocalTime] = useState(0);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;

        if (isRunning && gameStarted) {
            interval = setInterval(() => {
                setLocalTime((prevTime) => prevTime + 1);
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [isRunning, gameStarted]);

    useEffect(() => {
        setLocalTime(0);
    }, [resetSignal]);

    useEffect(() => {
        if (!isRunning && gameStarted) {
            onGameFinish(localTime);
        }
    }, [isRunning, gameStarted, localTime, onGameFinish]);

    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <span className="font-mono min-w-[6ch] text-right">
            {t('globals.time')}: {formatTime(localTime)}
        </span>
    );
};

export default Timer;
