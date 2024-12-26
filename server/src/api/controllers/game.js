const Game = require('../../api/models/game');

const getAllGames = async (req, res) => {
  try {
    const games = await Game.find();
    res.status(200).json({ data: games });
  } catch (error) {
    res.status(400).json({ error: 'Error getting Game/s' });
  }
};

const getGameById = async (req, res) => {
  try {
    const { id } = req.params;
    const game = await Game.findById(id);
    res.status(200).json({ data: game });
  } catch (error) {
    res.status(400).json({ error: 'Error getting Game by id' });
  }
};

const createGame = async (req, res) => {
  try {
    const { name, difficulty, type } = req.body;
    const coverPath = req.file ? req.file.path : 'none';

    const alreadyExists = await Game.findOne({ name: name });

    if (alreadyExists) {
      return res.status(400).json({ error: 'Game already exists' });
    }

    const newGame = new Game({
      name,
      difficulty,
      type,
      cover: coverPath ?? 'none',
    });

    await newGame.save();

    res.status(201).json({ data: newGame, message: 'Game created successfully!' });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 'Error creating Game' });
  }
};

const updateGameById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, difficulty, type } = req.body;
    const coverPath = req.file ? req.file.path : 'none';

    const newGame = await Game.findByIdAndUpdate(
      id,
      {
        name,
        difficulty,
        type,
        cover: coverPath ?? 'none',
      },
      { new: true }
    );

    res.status(201).json({ data: newGame, message: 'Game successfully Updated!' });
  } catch (error) {
    res.status(400).json({ error: 'Error updating Game' });
  }
};

const deleteGame = async (req, res) => {
  try {
    const { id } = req.params;
    await Game.deleteOne({ _id: id });
    res.status(200).json({ data: 'OK', message: 'Game successfully Deleted!' });
  } catch (error) {
    res.status(400).json({ error: 'Error deleting Game' });
  }
};

module.exports = {
  getAllGames,
  getGameById,
  createGame,
  updateGameById,
  deleteGame,
};

