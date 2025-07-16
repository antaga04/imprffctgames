import Game from '@/models/game';
import { Request, Response } from 'express';
import { SCORING_TYPES, GAME_TYPES } from '@/types/model';

// Get all games
export const getAllGames = async (req: Request, res: Response) => {
    try {
        const games = await Game.find();
        res.status(200).json({ success: true, data: games });
    } catch (error) {
        console.error('[getAllGames] Error:', error);
        res.status(500).json({ success: false, error: 'Error retrieving games' });
    }
};

// Get a game by ID
export const getGameById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ success: false, error: 'Invalid game ID' });
        }

        const game = await Game.findById(id);

        if (!game) {
            return res.status(404).json({ success: false, error: 'Game not found' });
        }

        res.status(200).json({ success: true, data: game });
    } catch (error) {
        console.error('[getGameById] Error:', error);
        res.status(500).json({ success: false, error: 'Error retrieving game' });
    }
};

// Create a new game
export const createGame = async (req: Request, res: Response) => {
    try {
        const { name, difficulty, type, scoringLogic } = req.body;

        const requiredFields: Record<string, any> = { name, difficulty, type, scoringLogic };
        const missingFields = Object.keys(requiredFields).filter((field) => !requiredFields[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                error: `Missing required fields: ${missingFields.join(', ')}`,
            });
        }

        // Validate scoringLogic
        if (!SCORING_TYPES.includes(scoringLogic)) {
            return res.status(400).json({
                success: false,
                error: `Invalid scoringLogic. Must be one of: ${SCORING_TYPES.join(', ')}`,
            });
        }

        if (!GAME_TYPES.includes(type)) {
            return res.status(400).json({
                success: false,
                error: `Invalid type. Must be one of: ${GAME_TYPES.join(', ')}`,
            });
        }

        const coverPath = req.file ? req.file.path : 'none';

        const alreadyExists = await Game.findOne({ name });
        if (alreadyExists) {
            return res.status(400).json({ success: false, error: 'Game with this name already exists' });
        }

        const newGame = new Game({
            name,
            difficulty,
            type,
            cover: coverPath,
            scoringLogic,
        });

        await newGame.save();

        res.status(201).json({ success: true, data: newGame, message: 'Game created successfully!' });
    } catch (error) {
        console.error('[createGame] Error:', error);
        res.status(500).json({ success: false, error: 'Error creating game' });
    }
};

// Update a game by ID
export const updateGameById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, difficulty, type, scoringLogic } = req.body;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ success: false, error: 'Invalid game ID' });
        }

        // Validate scoringLogic
        if (scoringLogic && !SCORING_TYPES.includes(scoringLogic)) {
            return res.status(400).json({
                success: false,
                error: `Invalid scoringLogic. Must be one of: ${SCORING_TYPES.join(', ')}`,
            });
        }

        if (type && !GAME_TYPES.includes(type)) {
            return res.status(400).json({
                success: false,
                error: `Invalid type. Must be one of: ${GAME_TYPES.join(', ')}`,
            });
        }

        const coverPath = req.file ? req.file.path : null;

        const updatedGame = await Game.findByIdAndUpdate(
            id,
            {
                ...(name && { name }),
                ...(difficulty && { difficulty }),
                ...(type && { type }),
                ...(scoringLogic && { scoringLogic }),
                ...(coverPath && { cover: coverPath }),
            },
            { new: true, runValidators: true },
        );

        if (!updatedGame) {
            return res.status(404).json({ success: false, error: 'Game not found' });
        }

        res.status(200).json({ success: true, data: updatedGame, message: 'Game updated successfully!' });
    } catch (error) {
        console.error('[updateGameById] Error:', error);
        res.status(500).json({ success: false, error: 'Error updating game' });
    }
};

// Delete a game by ID
export const deleteGame = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ success: false, error: 'Invalid game ID' });
        }

        const deletedGame = await Game.findByIdAndDelete(id);

        if (!deletedGame) {
            return res.status(404).json({ success: false, error: 'Game not found' });
        }

        res.status(200).json({ success: true, message: 'Game deleted successfully!' });
    } catch (error) {
        console.error('[deleteGame] Error:', error);
        res.status(500).json({ success: false, error: 'Error deleting game' });
    }
};
