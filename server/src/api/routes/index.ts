import { Router } from 'express';

import usersRouter from '@/routes/user';
import scoresRouter from '@/routes/score';
import gamesRouter from '@/routes/game';
import puzzle15Router from '@/routes/puzzle15';
import pokemonRouter from '@/routes/pokemon';

const router: Router = Router();

router.use('/users', usersRouter);
router.use('/scores', scoresRouter);
router.use('/games', gamesRouter);

router.use('/puzzle15', puzzle15Router);
router.use('/pokemon', pokemonRouter);

export default router;
