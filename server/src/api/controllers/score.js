const Score = require('../../api/models/score');

const getAllScores = async (req, res) => {
  try {
    const scores = await Score.find().populate([
      { path: 'game_id' },
      { path: 'user_id', select: 'nickname' },
    ]);
    res.status(200).json({ data: scores });
  } catch (error) {
    res.status(400).json({ error: 'Error getting Score/s' });
  }
};

const createScore = async (req, res) => {
  try {
    const { score, user_id, game_id } = req.body;

    const newScore = new Score({
      score,
      user_id,
      game_id,
    });

    await newScore.save();

    //! Buscar User con _id === user_id
    // if se encuentra: update User Scoresm => ...oldScores + newScore
    // else throw Error

    res.status(201).json({ data: newScore, message: 'Score created successfully!' });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 'Error creating Score' });
  }
};

const deleteScore = async (req, res) => {
  try {
    const { id } = req.params;
    await Score.deleteOne({ _id: id });
    res.status(200).json({ data: 'OK', message: 'Score successfully Deleted!' });
  } catch (error) {
    res.status(400).json({ error: 'Error deleting Score' });
  }
};

module.exports = {
  getAllScores,
  createScore,
  deleteScore,
};
