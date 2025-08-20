import { Request, Response } from 'express';
import { generateBoardHash } from '@/utils/crypto';
import { generateSolvableBoard } from '@/utils/puzzle15';
import GameSession from '@/models/gameSession';
import { sendError, sendSuccess } from '@/utils/response';
import { PUZZLE15_SLUG } from '@/utils/constants';
import { verifytoken } from '@/utils/jwt';

// API Endpoint: Generate a board and create a game session
export const generateBoard = async (req: Request, res: Response) => {
    try {
        const board = generateSolvableBoard();
        const hash = generateBoardHash(board);

        // TODO: use the token to get the guest user
        const token = req.cookies.token;
        let payload = { id: 'guestUser' };
        if (token) {
            payload = verifytoken(token);
        }

        const newSession = new GameSession({
            user_id: payload.id,
            game_slug: PUZZLE15_SLUG,
            state: board,
            hash,
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
