const express = require('express');
const { getAllScores, createScore, deleteScore } = require('../controllers/score');
const { hasValidAuthJwt, isAdmin } = require('../../middlewares/authenticated');

const router = express.Router();

router.get('/', getAllScores);
router.post('/', hasValidAuthJwt, isAdmin, createScore);
router.delete('/:id', hasValidAuthJwt, isAdmin, deleteScore);

module.exports = router;
