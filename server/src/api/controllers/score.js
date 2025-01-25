import Score from '../models/score.js';
import Game from '../models/game.js';
import User from '../models/user.js';
import { compareScores, validateScoreData, sortScores } from '../../utils/scoreUtils.js';
import { paginate } from '../../utils/paginationHelper.js';
import { decryptData } from '../../utils/crypto.js';

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

        const sortedScores = sortScores(scores, scoringLogic);

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

export const createScore = async (req, res) => {
    try {
        const { score } = req.body;
        const { scoreData, game_id } = decryptData(score);
        const { id: user_id } = req.user;

        if (!user_id || !game_id || !scoreData) {
            return res.status(400).json({ success: false, error: 'Missing required fields' });
        }

        const game = await Game.findById(game_id);
        if (!game) {
            return res.status(404).json({ success: false, error: 'Game not found' });
        }

        const { scoringLogic } = game;

        // Validate the scoreData based on scoringLogic
        if (!validateScoreData(scoreData, scoringLogic)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid score data for the scoring logic of this game',
            });
        }

        const existingScore = await Score.findOne({ user_id, game_id });

        let newScore;
        if (existingScore) {
            // Compare the new score with the existing score
            const isBetterScore = compareScores(existingScore.scoreData, scoreData, scoringLogic);

            if (isBetterScore) {
                existingScore.scoreData = scoreData;
                await existingScore.save();
                newScore = existingScore;
            } else {
                return res.status(200).json({
                    success: true,
                    message: 'New score is not better than the existing score',
                    data: existingScore,
                });
            }
        } else {
            // Create a new score
            newScore = new Score({ user_id, game_id, scoreData });
            await newScore.save();

            // Add the score to the user's scores
            await User.findByIdAndUpdate(user_id, { $push: { scores: newScore._id } }, { new: true });
        }

        res.status(201).json({
            success: true,
            data: newScore,
            message: 'Score uploaded successfully!',
        });
    } catch (error) {
        console.error('[createScore] Error:', error);
        res.status(500).json({ success: false, error: 'Error creating score' });
    }
};
