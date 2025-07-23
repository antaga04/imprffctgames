import { Router } from 'express';
import { checkPokemonResults, generatePokemonSession, getPokemonBatch } from '@/controllers/pokemon';

const router: Router = Router();

router.post('/', generatePokemonSession);
router.get('/:gameSessionId/:batchNumber', getPokemonBatch);
router.post('/results', checkPokemonResults);

export default router;
