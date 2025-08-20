import { GameSessionSchema } from '@/types/model';
import mongoose from 'mongoose';

const gameSessionSchema = new mongoose.Schema<GameSessionSchema>(
    {
        game_slug: {
            type: String,
            required: true,
            ref: 'Game',
        },
        user_id: {
            type: String, // TODO: change it to object id and be required
            ref: 'User',
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
            default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
            index: { expires: 0 }, // ⬅ This makes MongoDB automatically delete expired docs
        },
        variant: { type: String, required: false },
        gameplay: { type: Object, default: null },
    },
    {
        timestamps: true,
        collection: 'GameSession',
    },
);

const GameSession = mongoose.model<GameSessionSchema>('GameSession', gameSessionSchema, 'GameSession');

export default GameSession;
