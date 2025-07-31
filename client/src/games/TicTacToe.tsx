import { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import GameWrapper from '@/components/layouts/GameWrapper';
import CoolDownButton from '@/components/ui/CoolDownButton';
import { User, Users } from 'lucide-react';
import { toast } from 'sonner';

const PLAYER = {
    X: 'X',
    O: 'O',
} as const;

const GAME_MODE = {
    SINGLE: 'single',
    MULTI: 'multi',
} as const;

const GAME_STATUS = {
    PLAYING: 'playing',
    WON: 'won',
    DRAW: 'draw',
} as const;

const Game = () => {
    const [board, setBoard] = useState<Board>(Array(9).fill(null));
    const [currentPlayer, setCurrentPlayer] = useState<Player>(PLAYER.X);
    const [gameStatus, setGameStatus] = useState<GameStatus>(GAME_STATUS.PLAYING);
    const [statusMessage, setStatusMessage] = useState<string>(`Player ${PLAYER.X}'s turn`);
    const [showConfetti, setShowConfetti] = useState<boolean>(false);
    const [highlightSquares, setHighlightSquares] = useState<number[]>([]);
    const [stats, setStats] = useState<{ playerX: number; playerO: number; playernull: number }>({
        playerX: 0,
        playerO: 0,
        playernull: 0,
    });
    const [gameMode, setGameMode] = useState<GameMode>(GAME_MODE.SINGLE);

    const machineMove = (currentBoard: Board): void => {
        const availableSquares = currentBoard
            .map((square, index) => (square === null ? index : null))
            .filter((index) => index !== null) as number[];

        if (availableSquares.length === 0) return;

        const randomIndex = availableSquares[Math.floor(Math.random() * availableSquares.length)];

        setTimeout(() => {
            handleMove(randomIndex, PLAYER.O);
        }, 300);
    };

    const handleMove = (index: number, player: Player): void => {
        const newBoard = [...board];
        newBoard[index] = player;
        setBoard(newBoard);

        const winnerResult = checkForWinner(newBoard);

        if (winnerResult) {
            setGameStatus(GAME_STATUS.WON);
            setHighlightSquares(winnerResult.combination);
            setShowConfetti(true);
            setStatusMessage(`${winnerResult.player} wins! Congratulations!`);

            setStats((prevStats) => {
                const updatedStats = { ...prevStats };
                updatedStats[`player${winnerResult.player}`]++;
                return updatedStats;
            });
            return;
        }

        if (checkForDraw(newBoard)) {
            setGameStatus(GAME_STATUS.DRAW);
            setStatusMessage("It's a draw! Well played.");
            setStats((prevStats) => {
                const updatedStats = { ...prevStats };
                updatedStats.playernull++;
                return updatedStats;
            });
            return;
        }

        const nextPlayer = player === PLAYER.X ? PLAYER.O : PLAYER.X;
        setCurrentPlayer(nextPlayer);
        setStatusMessage(`Player ${nextPlayer}'s turn`);
    };

    const handleSquareClick = (index: number): void => {
        if (board[index] || gameStatus !== GAME_STATUS.PLAYING) return;

        if (gameMode === GAME_MODE.SINGLE && currentPlayer === PLAYER.O) return;

        handleMove(index, currentPlayer);
    };

    // manage machine moves
    useEffect(() => {
        if (gameMode === GAME_MODE.SINGLE && currentPlayer === PLAYER.O && gameStatus === GAME_STATUS.PLAYING) {
            machineMove(board);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPlayer, gameMode, gameStatus, board]);

    const checkForWinner = (board: Board): WinnerResult => {
        const winningCombinations = [
            [0, 1, 2], // Top row
            [3, 4, 5], // Middle row
            [6, 7, 8], // Bottom row
            [0, 3, 6], // Left column
            [1, 4, 7], // Middle column
            [2, 5, 8], // Right column
            [0, 4, 8], // Diagonal top-left to bottom-right
            [2, 4, 6], // Diagonal top-right to bottom-left
        ];

        for (const combination of winningCombinations) {
            const [a, b, c] = combination;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return { player: board[a], combination };
            }
        }

        return null;
    };

    const checkForDraw = (board: Board): boolean => {
        return board.every((square) => square !== null) && !checkForWinner(board);
    };

    const resetGame = (): void => {
        setBoard(Array(9).fill(null));
        setCurrentPlayer(PLAYER.X);
        setGameStatus(GAME_STATUS.PLAYING);
        setStatusMessage(`Player ${PLAYER.X}'s turn`);
        setShowConfetti(false);
        setHighlightSquares([]);
    };

    const changeGamemode = (): void => {
        setGameMode((prev) => (prev === GAME_MODE.SINGLE ? GAME_MODE.MULTI : GAME_MODE.SINGLE));
        toast.info(`${gameMode === GAME_MODE.SINGLE ? 'Multiplayer' : 'Single Player'} mode activated!`);
    };

    return (
        <>
            {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}

            <p className="text-lg mb-4 text-slate-300">{statusMessage}</p>
            <div
                role="grid"
                aria-label="Tic Tac Toe game board"
                className="grid grid-cols-3 gap-2 w-fit p-4 bg-gray-300 rounded-lg shadow-lg text-black"
            >
                {board.map((value, index) => (
                    <div
                        key={index}
                        role="button"
                        aria-label={`Square ${index + 1}`}
                        aria-pressed={value !== null}
                        style={{
                            backgroundColor: highlightSquares.includes(index) ? '#5ec269' : '',
                        }}
                        className={`w-20 h-20 flex items-center justify-center text-3xl rounded-md bg-gray-50 hover:bg-gray-100 duration-200 ease-in-out ${
                            gameMode === GAME_MODE.SINGLE && currentPlayer != PLAYER.X
                                ? 'cursor-not-allowed opacity-75'
                                : 'cursor-pointer'
                        }`}
                        onClick={() => handleSquareClick(index)}
                    >
                        {value}
                    </div>
                ))}
            </div>

            <section className="flex items-center gap-3 mt-6 text-lg text-slate-300">
                <p id="player1" className="flex flex-col items-center justify-center ">
                    <span>Player (X)</span>
                    <span className="text-2xl">{stats.playerX}</span>
                </p>
                <p id="tie" className="flex flex-col items-center justify-center ">
                    <span>-</span>
                    <span className="text-2xl">{stats.playernull}</span>
                </p>
                <p id="player2" className="flex flex-col items-center justify-center ">
                    <span>Player (O)</span>
                    <span className="text-2xl">{stats.playerO}</span>
                </p>
            </section>

            <section className="flex items-center mt-6 gap-3">
                <CoolDownButton
                    text="New Game"
                    onSubmit={resetGame}
                    bgColor="bg-red-600"
                    hoverBgColor="hover:bg-red-700"
                />
                <CoolDownButton
                    title="Switch Game Mode"
                    text={gameMode === GAME_MODE.SINGLE ? <User /> : <Users />}
                    onSubmit={changeGamemode}
                    bgColor="bg-gray-600"
                    hoverBgColor="hover:bg-gray-700"
                />
            </section>
        </>
    );
};

const TicTacToe = () => {
    return (
        <GameWrapper
            title="Tic Tac Toe"
            instructions="Click on a square to place your mark. The first player to get three in a row wins!"
        >
            <Game />
        </GameWrapper>
    );
};

export default TicTacToe;
