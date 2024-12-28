import express from 'express';
import { getAllScores, createScore, deleteScore, getScoresByGameId } from '../controllers/score.js';
import { hasValidAuthJwt } from '../../middlewares/authenticated.js';

const router = express.Router();

router.get('/', getAllScores);
router.get('/:game_id', getScoresByGameId);
router.post('/', hasValidAuthJwt, createScore);
router.delete('/:id', hasValidAuthJwt, deleteScore);

export default router;
