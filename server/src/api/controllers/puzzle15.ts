import { Request, Response } from 'express';
import { generateBoardHash } from '@/utils/crypto';
import { generateSolvableBoard } from '@/utils/puzzle15';
import GameSession from '@/models/gameSession';

const GAME_ID = process.env.PUZZLE15_ID;

// API Endpoint: Generate a board and create a game session
export const generateBoard = async (req: Request, res: Response) => {
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
