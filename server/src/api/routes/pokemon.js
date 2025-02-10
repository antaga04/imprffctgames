import express from 'express';
import { checkPokemonResults, generatePokemonSession, getPokemonBatch } from '../controllers/pokemon.js';

const router = express.Router();

router.post('/', generatePokemonSession);
router.get('/:gameSessionId/:batchNumber', getPokemonBatch);
router.post('/results', checkPokemonResults);

export default router;
