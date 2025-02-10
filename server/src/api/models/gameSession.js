import mongoose from 'mongoose';

const gameSessionSchema = new mongoose.Schema(
    {
        game_id: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: 'Game',
        },
        hash: {
            type: String,
        },
        state: {
            type: Array,
            required: true,
        },
        validatedResults: { type: Object, default: null },
        session_expiry: {
            type: Date,
            default: () => new Date(Date.now() + 30 * 60 * 1000),
            index: { expires: 0 }, // ⬅ This makes MongoDB automatically delete expired docs
        },
    },
    {
        timestamps: true,
        collection: 'GameSession',
    },
);

const GameSession = mongoose.model('GameSession', gameSessionSchema, 'GameSession');

export default GameSession;
