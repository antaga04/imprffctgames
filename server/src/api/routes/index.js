import express from 'express';

import usersRouter from './user.js';
import scoresRouter from './score.js';
import gamesRouter from './game.js';

const router = express.Router();

router.use('/users', usersRouter);
router.use('/scores', scoresRouter);
router.use('/games', gamesRouter);

export default router;
