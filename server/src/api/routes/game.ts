import { Router } from 'express';
import { getAllGames, createGame, updateGameById, deleteGame, getGameById } from '@/controllers/game';
import uploadFile from '@/middlewares/uploadFile';
import { hasValidAuthJwt, isAdmin } from '@/middlewares/authenticated';

const router: Router = Router();

router.get('/', getAllGames);
router.get('/:id', getGameById);
router.post('/', hasValidAuthJwt, isAdmin, uploadFile.single('cover'), createGame);
router.put('/:id', hasValidAuthJwt, isAdmin, uploadFile.single('cover'), updateGameById);
router.delete('/:id', hasValidAuthJwt, isAdmin, deleteGame);

export default router;
