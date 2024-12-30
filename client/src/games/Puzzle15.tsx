import { useState, useEffect, useCallback } from 'react';
import Confetti from 'react-confetti';
import GameWrapper from '@/components/layouts/GameWrapper';
import { useAuth } from '@/context/AuthContext';
import { TimerIncrementProps } from '@/types/types';
import { uploadScore } from '@/services/uploadScore';
import { toast } from 'sonner';
import CoolDownButton from '@/components/ui/CoolDownButton';

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
        setTime(0);
        setLocalTime(0);
    }, [resetSignal]);

    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return <span className="font-mono min-w-[6ch] text-right">Time: {formatTime(time)}</span>;
};

const Game = () => {
    const [board, setBoard] = useState(Array.from({ length: CELL_COUNT }, (_, i) => i));
    const [moves, setMoves] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [resetSignal, setResetSignal] = useState(0);
    const [time, setTime] = useState(0);
    const { user } = useAuth();

    useEffect(() => {
        shuffleBoard();
    }, []);

    const shuffleBoard = useCallback(() => {
        let newBoard;
        do {
            newBoard = Array.from({ length: CELL_COUNT }, (_, i) => i);
            for (let i = newBoard.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [newBoard[i], newBoard[j]] = [newBoard[j], newBoard[i]];
            }
        } while (!isSolvable(newBoard)); // Repeat until a solvable configuration is generated

        setBoard(newBoard);
        resetGameState();
    }, []);

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

    const handleGameCompletion = async () => {
        console.log('>>>> handleGameCompletion', moves, time);

        const scoreData = { moves, time };
        const gameId = import.meta.env.VITE_PUZZLE15_ID;

        if (user) {
            const loadingToastId = toast.loading('Uploading score...');

            try {
                const response = await uploadScore(scoreData, gameId);
                const { message, data } = response.data;

                toast.dismiss(loadingToastId);

                if (response.status === 200) {
                    toast.warning(
                        `${message}. Previous score: Moves: ${data.scoreData.moves}, Time: ${data.scoreData.time}`,
                    );
                } else if (response.status === 201) {
                    toast.success(
                        `${message}. New score: Moves: ${data.scoreData.moves}, Time: ${data.scoreData.time}`,
                    );
                } else {
                    toast.error(response.data.error);
                }
            } catch (error) {
                console.error('Error uploading score:', error);
                toast.dismiss(loadingToastId);
                toast.error('Error uploading score.');
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

    const isSolvable = (board: number[]): boolean => {
        const inversionCount = board.reduce((count, tile, i) => {
            if (tile === EMPTY_INDEX) return count;
            for (let j = i + 1; j < board.length; j++) {
                if (board[j] !== EMPTY_INDEX && board[i] > board[j]) {
                    count++;
                }
            }
            return count;
        }, 0);

        const emptyRowFromBottom = GRID_SIZE - Math.floor(board.indexOf(EMPTY_INDEX) / GRID_SIZE);

        if (GRID_SIZE % 2 === 1) {
            return inversionCount % 2 === 0;
        } else {
            return (
                (inversionCount % 2 === 0 && emptyRowFromBottom % 2 === 1) ||
                (inversionCount % 2 === 1 && emptyRowFromBottom % 2 === 0)
            );
        }
    };

    return (
        <>
            <p className="mb-4 text-lg text-slate-300 flex justify-between gap-4">
                <span className="font-mono min-w-[6ch] text-right">Moves: {String(moves).padStart(3, '0')}</span>
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
                <CoolDownButton text="New Game" onSubmit={shuffleBoard} />
            </div>
            <p className="mt-4 text-center">Move tiles in grid to order them from 1 to 15.</p>
            {isSolved() && gameStarted && (
                <div className="my-4 text-xl font-bold text-center text-white">
                    Congratulations! You solved the puzzle!
                </div>
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
