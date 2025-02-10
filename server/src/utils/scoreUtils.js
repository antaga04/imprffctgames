export function comparePokemonScores(existingScore, newScore) {
    const existingCalculatedScore = calculateGuessesCorrectTotal(existingScore);
    const newCalculatedScore = calculateGuessesCorrectTotal(newScore);

    return newCalculatedScore > existingCalculatedScore; // Higher score wins
}

export function comparePuzzle15Scores(existingScore, newScore) {
    // Lower `time` wins; tiebreaker is lower `moves`
    if (newScore.time !== existingScore.time) {
        return newScore.time < existingScore.time;
    }
    return newScore.moves < existingScore.moves;
}

export function sortPokemonScores(scores) {
    return scores.sort((a, b) => {
        const aScore = calculateGuessesCorrectTotal(a.scoreData);
        const bScore = calculateGuessesCorrectTotal(b.scoreData);

        return bScore - aScore; // Higher score first
    });
}

export function sortPuzzle15Scores(scores) {
    return scores.sort((a, b) => {
        if (a.scoreData.time !== b.scoreData.time) {
            return a.scoreData.time - b.scoreData.time; // Shorter time first
        }
        return a.scoreData.moves - b.scoreData.moves; // Fewer moves in case of a tie
    });
}

/**
 * Calculates the score for 'guesses_correct_total' logic.
 * @param {Object} score - An object containing the score's `correct` and `total` properties.
 * @param {number} penaltyFactor - A penalty factor applied to the calculation (default is 1.1).
 * @returns {number} - The calculated score value based on the guesses correct and total.
 */
function calculateGuessesCorrectTotal(score, penaltyFactor = 1.1) {
    const { correct, total } = score;
    return correct * Math.pow(correct / total, penaltyFactor);
}
