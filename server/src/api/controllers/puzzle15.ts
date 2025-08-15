import { Request, Response } from 'express';
import { generateBoardHash } from '@/utils/crypto';
import { generateSolvableBoard } from '@/utils/puzzle15';
import GameSession from '@/models/gameSession';
import { sendError, sendSuccess } from '@/utils/response';

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

        return sendSuccess(res, 201, {
            i18n: 'puzzle15.generateBoard.success',
            message: 'Puzzle board generated successfully.',
            payload: {
                board,
                hash,
                gameSessionId: newSession._id,
            },
        });
    } catch (error) {
        console.error('[generateBoard] Error:', error);
        return sendError(res, 500, {
            i18n: 'puzzle15.generateBoard.error',
            message: 'Failed to generate puzzle board.',
        });
    }
};
