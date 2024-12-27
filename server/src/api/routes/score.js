import express from 'express';
import { getAllScores, createScore, deleteScore } from '../controllers/score.js';
import { hasValidAuthJwt } from '../../middlewares/authenticated.js';

const router = express.Router();

router.get('/', getAllScores);
router.post('/', hasValidAuthJwt, createScore);
router.delete('/:id', hasValidAuthJwt, deleteScore);

export default router;
