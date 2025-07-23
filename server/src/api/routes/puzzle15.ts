import { Router } from 'express';
import { generateBoard } from '@/controllers/puzzle15';

const router: Router = Router();

router.get('/', generateBoard);

export default router;
