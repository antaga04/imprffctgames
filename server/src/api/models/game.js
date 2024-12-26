const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  name: { type: String, require: true },
  difficulty: { type: Number, require: true, min: 1, max: 5 },
  type: { type: String, require: true },
  cover: { type: String },
});

const Game = mongoose.model('Game', gameSchema, 'Game');

module.exports = Game;
