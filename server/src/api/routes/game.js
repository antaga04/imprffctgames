const express = require('express');
const {
  getAllGames,
  createGame,
  updateGameById,
  deleteGame,
  getGameById,
} = require('../controllers/game');
const uploadFile = require('../../middlewares/uploadFile');
const { hasValidAuthJwt, isAdmin } = require('../../middlewares/authenticated');

const router = express.Router();

router.get('/', getAllGames);
router.get('/:id', getGameById);
router.post('/', hasValidAuthJwt, isAdmin, uploadFile.single('cover'), createGame);
router.put('/:id', hasValidAuthJwt, isAdmin, uploadFile.single('cover'), updateGameById);
router.delete('/:id', hasValidAuthJwt, isAdmin, deleteGame);

module.exports = router;
