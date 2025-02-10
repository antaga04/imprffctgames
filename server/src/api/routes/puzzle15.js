import express from 'express';
import { generateBoard } from '../controllers/puzzle15.js';

const router = express.Router();

router.get('/', generateBoard);

export default router;
