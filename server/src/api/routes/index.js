const express = require('express');

const usersRouter = require('./user');
const scoresRouter = require('./score');
const gamesRouter = require('./game');

const router = express.Router();

router.use('/users', usersRouter);
router.use('/scores', scoresRouter);
router.use('/games', gamesRouter);

module.exports = router;
