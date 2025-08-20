import { validatePuzzle15ScoreData } from '@/api/validations/puzzle15Validation';
import { comparePuzzle15Scores, sortPuzzle15Scores } from '@/utils/scoreUtils';

export const puzzle15Handlers = {
    validate: validatePuzzle15ScoreData,
    compare: comparePuzzle15Scores,
    sortScores: sortPuzzle15Scores,
};
