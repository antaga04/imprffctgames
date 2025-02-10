import express from 'express';

import usersRouter from './user.js';
import scoresRouter from './score.js';
import gamesRouter from './game.js';
import puzzle15Router from './puzzle15.js';
import pokemonRouter from './pokemon.js';

const router = express.Router();

router.use('/users', usersRouter);
router.use('/scores', scoresRouter);
router.use('/games', gamesRouter);

router.use('/puzzle15', puzzle15Router);
router.use('/pokemon', pokemonRouter);

export default router;
