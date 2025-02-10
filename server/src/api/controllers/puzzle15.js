import { generateBoardHash } from '../../utils/crypto.js';
import GameSession from '../models/gameSession.js';

const GRID_SIZE = 4;
const CELL_COUNT = GRID_SIZE * GRID_SIZE;
const EMPTY_INDEX = CELL_COUNT - 1;

const GAME_ID = process.env.PUZZLE15_ID;

// Function to generate a solvable board
function generateSolvableBoard() {
    let board;
    do {
        board = Array.from({ length: CELL_COUNT }, (_, i) => i);
        for (let i = board.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [board[i], board[j]] = [board[j], board[i]];
        }
    } while (!isSolvable(board));

    return board;
}

// Check if a board is solvable
function isSolvable(board) {
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
}

// API Endpoint: Generate a board and create a game session
export const generateBoard = async (req, res) => {
    try {
        const board = generateSolvableBoard();
        const hash = generateBoardHash(board);

        const newSession = new GameSession({
            game_id: GAME_ID,
            state: board,
            hash,
            session_expiry: new Date(Date.now() + 20 * 60 * 1000),
        });

        await newSession.save();

        res.json({ board, hash, gameSessionId: newSession._id });
    } catch (error) {
        console.error('Error generating board or session:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
