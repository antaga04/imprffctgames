/**
 * Utility function to compare scores based on scoringLogic
 * @param {Object} existingScore - Existing score to compare against
 * @param {Object} newScore - New score to compare
 * @param {string} scoringLogic - Scoring logic of the game
 * @returns {boolean} - Returns true if `newScore` is better than `existingScore`, false otherwise
 */
export function compareScores(existingScore, newScore, scoringLogic) {
    switch (scoringLogic) {
        case 'guesses_correct_total': {
            const existingCalculatedScore = calculateGuessesCorrectTotal(existingScore);
            const newCalculatedScore = calculateGuessesCorrectTotal(newScore);

            return newCalculatedScore > existingCalculatedScore; // Higher score wins
        }

        case 'moves_time': {
            // Lower `time` wins; tiebreaker is lower `moves`
            if (newScore.time !== existingScore.time) {
                return newScore.time < existingScore.time;
            }
            return newScore.moves < existingScore.moves;
        }

        default:
            throw new Error('Unknown scoring logic');
    }
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
                const aScore = calculateGuessesCorrectTotal(a.scoreData);
                const bScore = calculateGuessesCorrectTotal(b.scoreData);

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

/**
 * Calculate the score for 'guesses_correct_total' logic.
 * @param {Object} score - Score object with `correct` and `total` properties.
 * @param {number} penaltyFactor - Penalty factor for the calculation.
 * @returns {number} - Calculated score value.
 */
function calculateGuessesCorrectTotal(score, penaltyFactor = 1.1) {
    const { correct, total } = score;
    return correct * Math.pow(correct / total, penaltyFactor);
}
