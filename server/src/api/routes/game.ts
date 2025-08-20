import { Router } from 'express';
import { getAllGames, createGame, updateGameById, deleteGame, getGameBySlug } from '@/controllers/game';
import uploadFile from '@/middlewares/uploadFile';
import { hasValidAuthJwt, isAdmin } from '@/middlewares/authenticated';

const router: Router = Router();

router.get('/', getAllGames);
router.get('/:slug', getGameBySlug);
router.post('/', hasValidAuthJwt, isAdmin, uploadFile('cover', 'games'), createGame);
router.put('/:id', hasValidAuthJwt, isAdmin, uploadFile('cover', 'games'), updateGameById);
router.delete('/:id', hasValidAuthJwt, isAdmin, deleteGame);

export default router;
