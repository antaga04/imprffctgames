import express from 'express';
import { getAllGames, createGame, updateGameById, deleteGame, getGameById } from '../controllers/game.js';
import uploadFile from '../../middlewares/uploadFile.js';
import { hasValidAuthJwt, isAdmin } from '../../middlewares/authenticated.js';

const router = express.Router();

router.get('/', getAllGames);
router.get('/:id', getGameById);
router.post('/', hasValidAuthJwt, isAdmin, uploadFile.single('cover'), createGame);
router.put('/:id', hasValidAuthJwt, isAdmin, uploadFile.single('cover'), updateGameById);
router.delete('/:id', hasValidAuthJwt, isAdmin, deleteGame);

export default router;
