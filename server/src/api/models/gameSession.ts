import { GameSessionSchema } from '@/types/model';
import mongoose from 'mongoose';

const gameSessionSchema = new mongoose.Schema<GameSessionSchema>(
    {
        game_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Game',
        },
        hash: {
            type: String,
        },
        state: {
            type: [mongoose.Schema.Types.Mixed as any],
            required: true,
        },
        validatedResults: { type: Object, default: null },
        session_expiry: {
            type: Date,
            default: () => new Date(Date.now() + 60 * 60 * 1000), // 1 hour
            index: { expires: 0 }, // ⬅ This makes MongoDB automatically delete expired docs
        },
        variant: { type: String, required: false },
    },
    {
        timestamps: true,
        collection: 'GameSession',
    },
);

const GameSession = mongoose.model<GameSessionSchema>('GameSession', gameSessionSchema, 'GameSession');

export default GameSession;
