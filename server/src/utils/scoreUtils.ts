import { ScoreDocument } from '@/types/model';

export function comparePokemonScores(existingScore: StoredPokemonScore, newScore: StoredPokemonScore) {
    const existingCalculatedScore = calculateGuessesCorrectTotal(existingScore);
    const newCalculatedScore = calculateGuessesCorrectTotal(newScore);

    return newCalculatedScore > existingCalculatedScore; // Higher score wins
}

export function comparePuzzle15Scores(existingScore: StoredPuzzle15Score, newScore: StoredPuzzle15Score) {
    // Lower `time` wins; tiebreaker is lower `moves`
    if (newScore.time !== existingScore.time) {
        return newScore.time < existingScore.time;
    }
    return newScore.moves < existingScore.moves;
}

export function sortPokemonScores(scores: ScoreDocument[]) {
    return scores.sort((a, b) => {
        const aScore = calculateGuessesCorrectTotal(a.scoreData as StoredPokemonScore);
        const bScore = calculateGuessesCorrectTotal(b.scoreData as StoredPokemonScore);

        return bScore - aScore; // Higher score first
    });
}

export function sortPuzzle15Scores(scores: ScoreDocument[]) {
    return scores.sort((a, b) => {
        if (a.scoreData.time !== b.scoreData.time) {
            return a.scoreData.time - b.scoreData.time; // Shorter time first
        }
        return a.scoreData.moves - b.scoreData.moves; // Fewer moves in case of a tie
    });
}

// Calculates the score for 'guesses_correct_total' logic.
function calculateGuessesCorrectTotal(score: StoredPokemonScore, penaltyFactor = 1.1) {
    const { correct, total } = score;
    return correct * Math.pow(correct / total, penaltyFactor);
}
