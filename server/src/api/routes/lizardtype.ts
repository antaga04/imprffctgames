import { Router } from 'express';
import { checkLizardTypeResults, generateGame } from '../controllers/games/lizardtype';

const router: Router = Router();

router.post('/', generateGame);
router.post('/results', checkLizardTypeResults);

export default router;
