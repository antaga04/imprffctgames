import express from 'express';
import { getAllScores, uploadScore, deleteScore, getScoresByGameId } from '@/controllers/score';
import { hasValidAuthJwt, isAdmin } from '@/middlewares/authenticated';

const router = express.Router();

router.get('/', getAllScores);
router.get('/:game_id', getScoresByGameId);
router.post('/', hasValidAuthJwt, uploadScore);
router.delete('/:id', hasValidAuthJwt, isAdmin, deleteScore);

export default router;
