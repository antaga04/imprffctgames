import { useState } from 'react';
import Confetti from 'react-confetti';
import GameWrapper from '@/components/layouts/GameWrapper';
import CoolDownButton from '@/components/ui/CoolDownButton';

// Define the types
type Player = 'X' | 'O' | null;
type Board = Player[];
type WinnerResult = { player: Player; combination: number[] } | null;

const Game = () => {
    const [board, setBoard] = useState<Board>(Array(9).fill(null));
    const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
    const [status, setStatus] = useState<string>(`Player X's turn`);
    const [winner, setWinner] = useState<Player>(null);
    const [showConfetti, setShowConfetti] = useState<boolean>(false);
    const [highlightSquares, setHighlightSquares] = useState<number[]>([]);

    const handleSquareClick = (index: number): void => {
        if (board[index] || winner) return;

        const newBoard = [...board];
        newBoard[index] = currentPlayer;
        setBoard(newBoard);

        const result = checkForWinner(newBoard);
        if (result) {
            setWinner(result.player);
            setHighlightSquares(result.combination);
            setShowConfetti(true);
            setStatus(`${result.player} wins! Congratulations!`);
            return;
        }

        if (checkForDraw(newBoard)) {
            setStatus("It's a draw! Well played.");
            return;
        }

        const nextPlayer = currentPlayer === 'X' ? 'O' : 'X';
        setCurrentPlayer(nextPlayer);
        setStatus(`Player ${nextPlayer}'s turn`);
    };

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
        setCurrentPlayer('X');
        setStatus(`Player X's turn`);
        setWinner(null);
        setShowConfetti(false);
        setHighlightSquares([]);
    };

    return (
        <>
            {showConfetti && <Confetti recycle={false} numberOfPieces={300} />}

            <p className="text-lg mb-4 text-slate-300">{status}</p>
            <div
                role="grid"
                aria-label="Tic Tac Toe game board"
                className="grid grid-cols-3 gap-2 w-fit z-10 p-4 bg-gray-300 rounded-lg shadow-lg text-black"
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
                        className="w-20 h-20 flex items-center justify-center text-3xl cursor-pointer rounded-md bg-gray-100 hover:bg-gray-50 duration-200 ease-in-out"
                        onClick={() => handleSquareClick(index)}
                    >
                        {value}
                    </div>
                ))}
            </div>

            <CoolDownButton
                text="Reset Game"
                onSubmit={resetGame}
                bgColor="bg-red-600"
                hoverBgColor="hover:bg-red-700"
                className="mt-6"
            />
        </>
    );
};

const TicTacToe = () => {
    return (
        <GameWrapper title="Tic Tac Toe">
            <Game />
        </GameWrapper>
    );
};

export default TicTacToe;
