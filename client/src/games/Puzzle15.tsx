/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback, useRef } from 'react';
import Confetti from 'react-confetti';
import GameWrapper from '@/components/layouts/GameWrapper';
import CoolDownButton from '@/components/ui/CoolDownButton';
import { getTargetIndex } from '@/lib/gameUtils';
import { useGameCompletion } from '@/hooks/useCompletion';
import { useTempScore } from '@/hooks/useTempScore';
import axios from 'axios';
import { toast } from 'sonner';
import { PUZZLE15_SLUG } from '@/lib/constants';
import Timer from '@/components/ui/Timers/Timer';
import { useFetch } from '@/hooks/useFetch';

const GRID_SIZE = 4;
const CELL_COUNT = GRID_SIZE * GRID_SIZE;
const EMPTY_INDEX = CELL_COUNT - 1;

const API_PUZZLE15_GAME_URL = `${import.meta.env.VITE_API_URL}/games/${PUZZLE15_SLUG}`;
const API_URL = import.meta.env.VITE_API_URL;

const Game: React.FC<{ game: GameSchema | null }> = ({ game }) => {
    const [board, setBoard] = useState(Array.from({ length: CELL_COUNT }, (_, i) => i));
    const [moves, setMoves] = useState<Move[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [resetSignal, setResetSignal] = useState(0);
    const [boardHash, setBoardHash] = useState('');
    const [gameSessionId, setGameSessionId] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCompletion = useGameCompletion(game?._id, PUZZLE15_SLUG);
    const { setTempScore } = useTempScore();
    const hasHandledCompletion = useRef(false);

    useEffect(() => {
        hasHandledCompletion.current = false;
        shuffleBoard();
    }, []);

    const shuffleBoard = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/puzzle15`, { withCredentials: true });
            const { board, hash, gameSessionId } = response.data.payload;

            if (board && hash) {
                setBoard(board);
                setBoardHash(hash);
                setGameSessionId(gameSessionId);
                resetGameState();
            }
        } catch (error) {
            console.error('Error fetching board:', error);
            const err = error as MyError;
            toast.error(err.response?.data?.message || 'Error fetching board.');
        } finally {
            setLoading(false);
        }
    }, []);

    const resetGameState = () => {
        setMoves([]);
        setIsRunning(false);
        setGameStarted(false);
        setShowConfetti(false);
        setResetSignal((prev) => prev + 1); // Timer reset
        hasHandledCompletion.current = false;
    };

    const isSolved = useCallback(() => {
        return board.every((tile, index) => tile === index);
    }, [board]);

    useEffect(() => {
        if (isSolved() && gameStarted) {
            setShowConfetti(true);
            setIsRunning(false);
        }
    }, [isSolved, gameStarted]);

    const handleGameCompletion = async (time: number) => {
        if (hasHandledCompletion.current) return;
        hasHandledCompletion.current = true;

        const scoreData = { moves, time, hash: boardHash, gameSessionId };
        if (!game) {
            return toast.error('Game was not found in the database.');
        }
        setTempScore({ scoreData, gameId: game._id, slug: game.slug });
        handleCompletion(scoreData);
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

                const timestamp = Date.now();
                setMoves((prevMoves) => [...prevMoves, { from: emptyIndex, to: tileIndex, timestamp }]);

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

    useEffect(() => {
        if (isSolved()) return;
        const activeKeys = new Set<string>();

        const handleKeyDown = (event: KeyboardEvent) => {
            activeKeys.add(event.key);

            const emptyIndex = board.indexOf(EMPTY_INDEX);
            const emptyRow = Math.floor(emptyIndex / GRID_SIZE);
            const emptyCol = emptyIndex % GRID_SIZE;

            // Handle each active key (in case multiple keys are pressed simultaneously)
            activeKeys.forEach((key) => {
                const targetIndex = getTargetIndex(key, emptyIndex, emptyRow, emptyCol, GRID_SIZE);
                if (targetIndex !== null && canMoveTile(targetIndex)) {
                    moveTile(targetIndex);

                    activeKeys.clear();
                }
            });
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            activeKeys.delete(event.key);
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [board, canMoveTile, moveTile]);

    return (
        <>
            {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
            <p className="mb-4 text-lg text-slate-300 flex justify-between gap-4">
                <Timer
                    isRunning={isRunning}
                    gameStarted={gameStarted}
                    resetSignal={resetSignal}
                    onGameFinish={handleGameCompletion} // callback to capture final time
                />
                <span className="font-mono min-w-[6ch] text-right">Moves: {String(moves.length).padStart(3, '0')}</span>
            </p>
            <div className="grid grid-cols-4 gap-2 p-4 bg-gray-300 rounded-lg shadow-lg text-black relative">
                {loading && (
                    <span className="w-full h-full absolute backdrop-blur-sm flex justify-center items-center font-bold">
                        Loading...
                    </span>
                )}
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
                        disabled={tile === EMPTY_INDEX || !canMoveTile(index) || isSolved()}
                    >
                        {tile === EMPTY_INDEX ? '' : tile + 1}
                    </button>
                ))}
            </div>
            <div className="mt-4 space-x-4">
                <CoolDownButton text="New Game" onSubmit={shuffleBoard} />
            </div>
            {isSolved() && gameStarted && (
                <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 mx-4">
                        <div className="text-center text-gray-800 space-y-4">
                            <h2 className="text-3xl font-bold text-[var(--blueish)]">Congratulations!</h2>
                            <p className="text-lg">You solved the puzzle 🚀</p>
                            <div className="mt-4 space-x-4">
                                <CoolDownButton text="Play again" onSubmit={shuffleBoard} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

const Puzzle15: React.FC = () => {
    const { data: game } = useFetch<GameSchema>(API_PUZZLE15_GAME_URL);

    return (
        <GameWrapper title="15 Puzzle" instructions={game?.info?.instructions}>
            <Game game={game} />
        </GameWrapper>
    );
};

export default Puzzle15;
