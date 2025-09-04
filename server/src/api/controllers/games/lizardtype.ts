import { Request, Response } from 'express';
import { generateBoardHash } from '@/utils/crypto';
import GameSession from '@/models/gameSession';
import { sendError, sendSuccess } from '@/utils/response';
import { LIZARD_LANGUAGE_MAP, LIZARDTYPE_SLUG } from '@/utils/constants';
import { verifytoken } from '@/utils/jwt';
import { calculateTypingMetrics, generateWords } from '@/utils/games/lizardtype';

// API Endpoint: Generate a game and create a game session
export const generateGame = async (req: Request, res: Response) => {
    try {
        const { language, variant } = req.body;
        const list = LIZARD_LANGUAGE_MAP[language as keyof typeof LIZARD_LANGUAGE_MAP];
        const words = generateWords(list);
        const hash = generateBoardHash({ words, variant, language });

        // TODO: use the token to get the guest user
        const token = req.cookies.token;
        let payload = { id: 'guestUser' };
        if (token) {
            payload = verifytoken(token);
        }

        const newSession = new GameSession({
            user_id: payload.id,
            game_slug: LIZARDTYPE_SLUG,
            state: words,
            hash,
        });

        await newSession.save();

        return sendSuccess(res, 201, {
            i18n: 'lizardtype.generateGame.success',
            message: 'Lizard Type game generated successfully.',
            payload: {
                words,
                hash,
                gameSessionId: newSession._id,
            },
        });
    } catch (error) {
        console.error('[generateGame] Error:', error);
        return sendError(res, 500, {
            i18n: 'lizardtype.generateGame.error',
            message: 'Failed to generate Lizard Type game.',
        });
    }
};

export const checkLizardTypeResults = async (req: Request, res: Response) => {
    try {
        const { hash, gameSessionId, keystrokes, variant } = req.body;
        const { id } = req.user ?? {};

        if (!Array.isArray(keystrokes) || keystrokes.length === 0) {
            return sendError(res, 400, {
                i18n: 'lizardtype.invalid_keystrokes',
                message: 'Invalid keystrokes data.',
            });
        }

        const session = await GameSession.findById(gameSessionId);
        if (!session) {
            return sendError(res, 400, {
                i18n: 'lizardtype.session_not_found',
                message: 'Lizard Type game session not found.',
            });
        }

        session.gameplay = keystrokes;

        // const expectedText = session.state.join(' ');
        const expectedText = session.state;
        const results = calculateTypingMetrics(keystrokes, expectedText, Number(variant));

        session.validatedResults = { ...results, variant };
        await session.save();

        return sendSuccess(res, 200, {
            i18n: 'lizardtype.results_checked',
            message: 'Lizard Type results checked successfully.',
            payload: results,
        });
    } catch (error) {
        console.error('[checkLizardTypeResults] Error:', error);
        return sendError(res, 500, {
            i18n: 'lizardtype.results_check_failed',
            message: 'Failed to check Lizard Type results.',
        });
    }
};
