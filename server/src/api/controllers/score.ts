import { Request, Response } from 'express';
import Score from '@/models/score';
import User from '@/models/user';
import { validatePokemonScoreData } from '@/validations/pokemonValidation';
import { validatePuzzle15ScoreData } from '@/validations/puzzle15Validation';
import { paginate } from '@/utils/paginationHelper';
import { comparePokemonScores, comparePuzzle15Scores, sortPokemonScores, sortPuzzle15Scores } from '@/utils/scoreUtils';
import { AuthenticatedRequest } from '@/types';
import { Types } from 'mongoose';
import { ScoreDocument } from '@/types/model';

const POKEMON_ID = process.env.POKEMON_ID!;
const PUZZLE15_ID = process.env.PUZZLE15_ID!;

const GAME_SCORING = {
    [POKEMON_ID]: {
        validate: validatePokemonScoreData,
        compare: comparePokemonScores,
        sortScores: sortPokemonScores,
    },
    [PUZZLE15_ID]: {
        validate: validatePuzzle15ScoreData,
        compare: comparePuzzle15Scores,
        sortScores: sortPuzzle15Scores,
    },
};

export const getAllScores = async (req: Request, res: Response) => {
    try {
        const { game_id } = req.query;

        if (!game_id || typeof game_id !== 'string') {
            return res.status(400).json({ success: false, error: 'Game ID is required' });
        }

        if (!Types.ObjectId.isValid(game_id)) {
            return res.status(400).json({ success: false, error: 'Invalid game ID format' });
        }

        const scores = await Score.find({ game_id })
            .populate('user_id', 'nickname avatar')
            .populate('game_id', 'name cover')
            .sort({ scoreData: -1 });

        res.status(200).json({
            success: true,
            data: scores,
            message: 'Scores retrieved successfully!',
        });
    } catch (error) {
        console.error('[getAllScores] Error:', error);
        res.status(500).json({
            success: false,
            error: 'Error retrieving scores',
        });
    }
};

export const deleteScore = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid score ID format' });
        }
        await Score.deleteOne({ _id: id });
        res.status(200).json({ data: 'OK', message: 'Score successfully Deleted!' });
    } catch (error) {
        res.status(400).json({ error: 'Error deleting Score' });
    }
};

export const getScoresByGameId = async (req: Request, res: Response) => {
    try {
        const { game_id } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const scores = await Score.find({ game_id })
            .populate('user_id', 'nickname avatar')
            .populate('game_id', 'name cover')
            .lean();

        const gameLogic = GAME_SCORING[game_id];

        const sortedScores = gameLogic.sortScores(scores as ScoreDocument[]);

        // Paginate the sorted scores
        const { paginatedData, pagination } = paginate(sortedScores, String(page), String(limit));

        res.status(200).json({
            success: true,
            data: paginatedData,
            pagination,
            message: 'Scores retrieved successfully!',
        });
    } catch (error) {
        console.error('[getScoresByGameId] Error:', error);
        res.status(500).json({ success: false, error: 'Error retrieving scores' });
    }
};

export const uploadScore = async (req: Request, res: Response) => {
    try {
        const { scoreData, game_id } = req.body.scoreData;
        const { id: user_id } = (req as AuthenticatedRequest).user;

        if (!user_id || !game_id || !scoreData) {
            return res.status(400).json({ success: false, error: 'Missing required fields' });
        }

        const gameLogic = GAME_SCORING[game_id];
        if (!gameLogic) {
            return res.status(400).json({ success: false, error: 'Invalid game ID' });
        }

        const { isValid, newScore } = await gameLogic.validate(scoreData);
        if (!isValid) {
            await User.updateOne({ _id: user_id }, { $inc: { strikes: 1 } });

            return res.status(400).json({
                success: false,
                error: 'Score data invalid. Potential cheating detected 👺.',
            });
        }

        let existingScore = await Score.findOne({ user_id, game_id });

        if (existingScore) {
            if (!gameLogic.compare(existingScore.scoreData as StoredPuzzle15Score & StoredPokemonScore, newScore)) {
                return res.status(200).json({
                    success: true,
                    message: 'New score is not better than the existing score',
                    data: existingScore,
                });
            }
            existingScore.scoreData = newScore;
            await existingScore.save();
        } else {
            existingScore = new Score({ user_id, game_id, scoreData: newScore });
            await existingScore.save();
            await User.findByIdAndUpdate(user_id, { $push: { scores: existingScore._id } }, { new: true });
        }

        res.status(201).json({
            success: true,
            data: existingScore,
            message: 'Score uploaded successfully!',
        });
    } catch (error) {
        console.error('[uploadScore] Error:', error);
        res.status(500).json({ success: false, error: 'Error creating score' });
    }
};
