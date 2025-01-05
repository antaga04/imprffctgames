/**
 * Utility function to compare scores based on scoringLogic
 * @param {Object} existingScore - Existing score to compare against
 * @param {Object} newScore - New score to compare
 * @param {string} scoringLogic - Scoring logic of the game
 * @returns
 */
export function compareScores(existingScore, newScore, scoringLogic) {
    if (scoringLogic === 'guesses_correct_total') {
        // Higher `correct` wins; tiebreaker is higher `total`
        if (newScore.correct > existingScore.correct) return true;
        if (newScore.correct === existingScore.correct && newScore.total > existingScore.total) return true;
    } else if (scoringLogic === 'moves_time') {
        // Lower `time` wins; tiebreaker is lower `moves`
        if (newScore.time < existingScore.time) return true;
        if (newScore.time === existingScore.time && newScore.moves < existingScore.moves) return true;
    }
    return false;
}

/**
 * Validates the score data for a given scoring logic.
 * @param {Object} scoreData - The score data to validate.
 * @param {string} scoringLogic - The scoring logic of the game.
 * @returns {Boolean} - Returns true if the score data is valid, false otherwise.
 */
export function validateScoreData(scoreData, scoringLogic) {
    if (!scoreData || typeof scoringLogic !== 'string') return false;

    switch (scoringLogic) {
        case 'guesses_correct_total': {
            const { correct, total } = scoreData;
            return (
                typeof correct === 'number' &&
                typeof total === 'number' &&
                correct >= 0 &&
                total > 0 &&
                correct <= total
            );
        }

        case 'moves_time': {
            const { moves, time } = scoreData;
            return typeof moves === 'number' && typeof time === 'number' && moves >= 0 && time >= 0;
        }

        default:
            return false; // Unknown scoring logic
    }
}

/**
 * Sort scores based on the game's scoring logic.
 * @param {Array} scores - Array of scores to sort.
 * @param {string} scoringLogic - Scoring logic used by the game.
 * @returns {Array} - Sorted array of scores.
 */
export const sortScores = (scores, scoringLogic) => {
    switch (scoringLogic) {
        case 'guesses_correct_total':
            return scores.sort((a, b) => {
                const p = 2; // Penalty factor
                const aCorrect = a.scoreData.correct;
                const aTotal = a.scoreData.total;
                const bCorrect = b.scoreData.correct;
                const bTotal = b.scoreData.total;

                const aScore = aCorrect * Math.pow(aCorrect / aTotal, p);
                const bScore = bCorrect * Math.pow(bCorrect / bTotal, p);

                return bScore - aScore; // Higher score first
            });

        case 'moves_time':
            return scores.sort((a, b) => {
                if (a.scoreData.time !== b.scoreData.time) {
                    return a.scoreData.time - b.scoreData.time; // Shorter time first
                }
                return a.scoreData.moves - b.scoreData.moves; // Fewer moves in case of a tie
            });

        default:
            throw new Error('Unknown scoring logic');
    }
};
