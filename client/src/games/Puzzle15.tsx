import { useState, useEffect, useCallback } from 'react';
import Confetti from 'react-confetti';
import GameWrapper from '@/components/layouts/GameWrapper';
import { useAuth } from '@/context/AuthContext';
import { TimerIncrementProps } from '@/types/types';
import { uploadScore } from '@/services/uploadScore';
import { toast } from 'sonner';

const GRID_SIZE = 4;
const CELL_COUNT = GRID_SIZE * GRID_SIZE;
const EMPTY_INDEX = CELL_COUNT - 1;

const Timer: React.FC<TimerIncrementProps> = ({ isRunning, gameStarted, resetSignal, setTime }) => {
    const [time, setLocalTime] = useState(0);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;

        if (isRunning && gameStarted) {
            interval = setInterval(() => {
                setLocalTime((prevTime) => prevTime + 1);
                setTime((prevTime) => prevTime + 1);
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [isRunning, gameStarted, setTime]);

    useEffect(() => {
        setLocalTime(0);
    }, [resetSignal]);

    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return <span> Time: {formatTime(time)}</span>;
};

const Game = () => {
    const [board, setBoard] = useState(Array.from({ length: CELL_COUNT }, (_, i) => i));
    const [moves, setMoves] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [initialBoard, setInitialBoard] = useState([...board]);
    const [showConfetti, setShowConfetti] = useState(false);
    const [resetSignal, setResetSignal] = useState(0);
    const [time, setTime] = useState(0);
    const { user } = useAuth();

    useEffect(() => {
        shuffleBoard();
    }, []);

    const shuffleBoard = useCallback(() => {
        const newBoard = Array.from({ length: CELL_COUNT }, (_, i) => i);
        for (let i = newBoard.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newBoard[i], newBoard[j]] = [newBoard[j], newBoard[i]]; //! Fisher-Yates shuffle
        }
        setBoard(newBoard);
        setInitialBoard([...newBoard]);
        resetGameState();
    }, []);

    const resetBoard = useCallback(() => {
        setBoard([...initialBoard]);
        resetGameState();
    }, [initialBoard]);

    const resetGameState = () => {
        setMoves(0);
        setIsRunning(false);
        setGameStarted(false);
        setShowConfetti(false);
        setResetSignal((prev) => prev + 1); // Trigger Timer reset
    };

    const isSolved = useCallback(() => {
        return board.every((tile, index) => tile === index);
    }, [board]);

    useEffect(() => {
        if (isSolved() && gameStarted) {
            setShowConfetti(true);
            setIsRunning(false);
            handleGameCompletion();
        }
    }, [isSolved, gameStarted]);

    const handleGameCompletion = () => {
        const scoreData = { moves, time };
        const gameId = '676f137d31fbdf3e1d79b172';

        if (user) {
            try {
                toast.promise(uploadScore(scoreData, gameId), {
                    loading: 'Uploading score...',
                    success: 'Your score has been uploaded!',
                    error: (err) => err.response?.data?.error || 'Error! Could not upload score.',
                });
            } catch (error) {
                console.error('Error uploading score:', error);
                throw new Error('Failed to upload score');
            }
        }
    };

    const canMoveTile = useCallback(
        (tileIndex: number): boolean => {
            const tileRow = Math.floor(tileIndex / GRID_SIZE);
            const tileCol = tileIndex % GRID_SIZE;
            const emptyRow = Math.floor(board.indexOf(EMPTY_INDEX) / GRID_SIZE);
            const emptyCol = board.indexOf(EMPTY_INDEX) % GRID_SIZE;

            return (
                (Math.abs(tileRow - emptyRow) === 1 && tileCol === emptyCol) ||
                (Math.abs(tileCol - emptyCol) === 1 && tileRow === emptyRow)
            );
        },
        [board],
    );

    const moveTile = useCallback(
        (tileIndex: number): void => {
            if (canMoveTile(tileIndex)) {
                const newBoard = [...board];
                const emptyIndex = newBoard.indexOf(EMPTY_INDEX);
                [newBoard[tileIndex], newBoard[emptyIndex]] = [newBoard[emptyIndex], newBoard[tileIndex]];
                setBoard(newBoard);
                setMoves((prev) => prev + 1);

                if (!gameStarted) {
                    setGameStarted(true);
                    setIsRunning(true);
                }
            }
        },
        [board, canMoveTile, gameStarted],
    );

    const isCorrectPosition = useCallback(
        (tile: number, index: number): boolean => tile === index && tile !== EMPTY_INDEX,
        [],
    );

    return (
        <>
            <p className="mb-4 text-lg text-slate-300">
                <span>Moves: {moves} |</span>
                <Timer isRunning={isRunning} gameStarted={gameStarted} resetSignal={resetSignal} setTime={setTime} />
            </p>
            {showConfetti && <Confetti recycle={false} numberOfPieces={300} />}
            <div className="grid grid-cols-4 gap-2 p-4 bg-gray-300 rounded-lg shadow-lg text-black">
                {board.map((tile, index) => (
                    <button
                        key={tile}
                        onClick={() => moveTile(index)}
                        className={`w-16 h-16 text-xl font-bold rounded-md transition-colors duration-300 focus:outline-none ${
                            tile === EMPTY_INDEX
                                ? 'bg-gray-300'
                                : isCorrectPosition(tile, index)
                                  ? 'bg-green-200 hover:bg-green-300'
                                  : 'bg-gray-100 hover:bg-gray-200'
                        } ${canMoveTile(index) ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                        disabled={tile === EMPTY_INDEX || !canMoveTile(index)}
                    >
                        {tile === EMPTY_INDEX ? '' : tile + 1}
                    </button>
                ))}
            </div>
            <div className="mt-4 space-x-4">
                <button
                    onClick={shuffleBoard}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300"
                >
                    New Game
                </button>
                <button
                    onClick={resetBoard}
                    className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors duration-300"
                >
                    Reset
                </button>
            </div>
            {isSolved() && gameStarted && (
                <div className="mt-4 text-xl font-bold text-green-600">Congratulations! You solved the puzzle!</div>
            )}
        </>
    );
};

const Puzzle15 = () => {
    return (
        <GameWrapper title="15 Puzzle">
            <Game />
        </GameWrapper>
    );
};

export default Puzzle15;
