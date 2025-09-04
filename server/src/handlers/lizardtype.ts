import { validateLizardtypeScoreData } from '@/api/validations/lizardtype.validation';
import { compareLizardtypeScores, sortLizardtypeScores } from '@/utils/scoreUtils';

export const lizardtypeHandlers = {
    validate: validateLizardtypeScoreData,
    compare: compareLizardtypeScores,
    sortScores: sortLizardtypeScores,
};
