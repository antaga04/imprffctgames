import { ScoreDocument } from '@/types/model';
import mongoose from 'mongoose';

const scoreSchema = new mongoose.Schema<ScoreDocument>(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        game_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Game',
        },
        scoreData: {
            type: Object,
            required: true,
        }, // Flexible structure based on the game's scoring logic
    },
    {
        timestamps: true,
        collection: 'Score',
    },
);

// Index for efficient querying of scores by user and game
scoreSchema.index({ user_id: 1, game_id: 1 });

const Score = mongoose.model<ScoreDocument>('Score', scoreSchema);

export default Score;
