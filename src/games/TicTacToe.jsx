import { useState } from 'react';
import Confetti from 'react-confetti';
import BackButton from '../components/BackButton';

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [status, setStatus] = useState(`Player ${currentPlayer}'s turn`);
  const [winner, setWinner] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [highlightSquares, setHighlightSquares] = useState([]);

  const handleSquareClick = (index) => {
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

    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    setStatus(`Player ${currentPlayer === 'X' ? 'O' : 'X'}'s turn`);
  };

  const checkForWinner = (board) => {
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

    for (let combination of winningCombinations) {
      const [a, b, c] = combination;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { player: board[a], combination };
      }
    }

    return null;
  };

  const checkForDraw = (board) => {
    return board.every((square) => square) && !checkForWinner(board);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setStatus(`Player X's turn`);
    setWinner(null);
    setShowConfetti(false);
    setHighlightSquares([]);
  };

  return (
    <>
      {showConfetti && <Confetti />}

      <BackButton />

      <div className="min-h-screen flex flex-col justify-center items-center flex-1 gradient">
        <div className="project-overview-noise"></div>
        <h1 className="text-4xl font-bold text-center neon-text text-white mb-4">Tic Tac Toe</h1>

        {/* Game Status */}
        <p className="text-lg mb-4 text-slate-300">{status}</p>

        <div
          role="grid"
          aria-label="Tic Tac Toe game board"
          className="grid grid-cols-3 gap-2 w-fit z-10 p-4 bg-gray-300 rounded-lg shadow-lg"
        >
          {board.map((value, index) => (
            <div
              key={index}
              role="button"
              aria-label={`Square ${index + 1}`}
              aria-pressed={value ? true : false}
              style={{
                backgroundColor: highlightSquares.includes(index) ? '#5ec269' : '',
              }}
              className="w-20 h-20 flex items-center justify-center text-3xl cursor-pointer rounded-md bg-gray-100"
              onClick={() => handleSquareClick(index)}
            >
              {value}
            </div>
          ))}
        </div>

        <button
          className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 z-10"
          onClick={resetGame}
        >
          Reset Game
        </button>
      </div>
    </>
  );
};

export default TicTacToe;
