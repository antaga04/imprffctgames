import { useEffect, useState } from 'react';

const DecrementTimer: React.FC<DecrementTimerProps> = ({ onGameFinished, resetSignal, gameSessionId, initialTime }) => {
    const [timeLeft, setTimeLeft] = useState<number>(initialTime);

    useEffect(() => {
        setTimeLeft(initialTime);

        if (!gameSessionId) {
            return;
        }

        const interval = setInterval(() => {
            setTimeLeft((prevTime) => Math.max(prevTime - 1, 0));
        }, 1000);

        return () => clearInterval(interval);
        // eslint-disable-next-line
    }, [resetSignal, gameSessionId]);

    useEffect(() => {
        if (timeLeft === 0) {
            onGameFinished();
        }
    }, [timeLeft, onGameFinished]);

    const timeColorClass = timeLeft < 11 ? 'text-red-600' : 'text-white';

    return (
        <p className="font-mono min-w-[6ch] text-right">
            Time: <span className={`font-mono ${timeColorClass}`}>{String(timeLeft).padStart(2, '0')}s</span>
        </p>
    );
};

export default DecrementTimer;
