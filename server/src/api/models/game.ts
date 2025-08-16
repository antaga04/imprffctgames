import mongoose from 'mongoose';
import { GAME_TYPES, GameSchema, SCORING_TYPES } from '@/types/model';

const gameSchema = new mongoose.Schema<GameSchema>({
    name: { type: String, required: true },
    difficulty: { type: Number, required: true, min: 1, max: 5 },
    type: { type: String, required: true, enum: GAME_TYPES },
    cover: { type: String },
    scoringLogic: {
        type: String,
        required: true,
        enum: SCORING_TYPES,
    },
    variants: [
        {
            key: { type: Number, required: true }, // e.g., '15s'
            label: { type: String, required: true }, // e.g., '15 seconds'
        },
    ],
});

const Game = mongoose.model<GameSchema>('Game', gameSchema, 'Game');

export default Game;
export { SCORING_TYPES, GAME_TYPES };
