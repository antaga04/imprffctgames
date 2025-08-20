import { validatePokemonScoreData } from '@/api/validations/pokemonValidation';
import { comparePokemonScores, sortPokemonScores } from '@/utils/scoreUtils';

export const pokemonHandlers = {
    validate: validatePokemonScoreData,
    compare: comparePokemonScores,
    sortScores: sortPokemonScores,
};
