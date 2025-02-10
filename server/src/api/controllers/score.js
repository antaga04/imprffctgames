import Score from '../models/score.js';
import Game from '../models/game.js';
import User from '../models/user.js';
import { paginate } from '../../utils/paginationHelper.js';
import { validatePokemonScoreData } from '../validations/pokemonValidation.js';
import { validatePuzzle15ScoreData } from '../validations/puzzle15Validation.js';
import {
    comparePokemonScores,
    comparePuzzle15Scores,
    sortPokemonScores,
    sortPuzzle15Scores,
} from '../../utils/scoreUtils.js';

const GAME_SCORING = {
    [process.env.POKEMON_ID]: {
        validate: validatePokemonScoreData,
        compare: comparePokemonScores,
        updateScoreData: (newScore) => newScore,
        sortScores: sortPokemonScores,
    },
    [process.env.PUZZLE15_ID]: {
        validate: validatePuzzle15ScoreData,
        compare: comparePuzzle15Scores,
        updateScoreData: (newScore) => newScore,
        sortScores: sortPuzzle15Scores,
    },
};

export const getAllScores = async (req, res) => {
    try {
        const { game_id } = req.query;

        const query = {};
        if (game_id) {
            query.game_id = game_id;
        }

        const scores = await Score.find(query)
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

export const deleteScore = async (req, res) => {
    try {
        const { id } = req.params;
        await Score.deleteOne({ _id: id });
        res.status(200).json({ data: 'OK', message: 'Score successfully Deleted!' });
    } catch (error) {
        res.status(400).json({ error: 'Error deleting Score' });
    }
};

export const getScoresByGameId = async (req, res) => {
    try {
        const { game_id } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const game = await Game.findById(game_id);
        if (!game) {
            return res.status(404).json({ success: false, error: 'Game not found' });
        }

        const { scoringLogic } = game;

        const scores = await Score.find({ game_id })
            .populate('user_id', 'nickname avatar')
            .populate('game_id', 'name cover')
            .lean();

        const gameLogic = GAME_SCORING[game_id];

        const sortedScores = gameLogic.sortScores(scores, scoringLogic);

        // Paginate the sorted scores
        const { paginatedData, pagination } = paginate(sortedScores, page, limit);

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

export const uploadScore = async (req, res) => {
    try {
        const { scoreData, game_id } = req.body.score;
        const { id: user_id } = req.user;

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
            if (!gameLogic.compare(existingScore.scoreData, newScore)) {
                return res.status(200).json({
                    success: true,
                    message: 'New score is not better than the existing score',
                    data: existingScore,
                });
            }
            existingScore.scoreData = gameLogic.updateScoreData(newScore);
            await existingScore.save();
        } else {
            existingScore = new Score({ user_id, game_id, scoreData: gameLogic.updateScoreData(newScore) });
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
