import mongoose from 'mongoose';

const SCORING_TYPES = ['guesses_correct_total', 'moves_time'];
const GAME_TYPES = ['quiz', 'puzzle', 'word_game', 'memory_game'];

const gameSchema = new mongoose.Schema({
    name: { type: String, required: true },
    difficulty: { type: Number, required: true, min: 1, max: 5 },
    type: { type: String, required: true, enum: GAME_TYPES },
    cover: { type: String },
    scoringLogic: {
        type: String,
        required: true,
        enum: SCORING_TYPES,
    },
});

const Game = mongoose.model('Game', gameSchema, 'Game');

export default Game;
export { SCORING_TYPES, GAME_TYPES };
