import User from '@/api/models/user';
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

export function compareLizardtypeScores(existingScore: LizardtypeNewScore, newScore: LizardtypeNewScore) {
    // More `wpm` wins; tiebreaker is better `accuracy`
    if (newScore.wpm !== existingScore.wpm) {
        return newScore.wpm > existingScore.wpm;
    }
    return newScore.accuracy > existingScore.accuracy;
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

export function sortLizardtypeScores(scores: ScoreDocument[]) {
    return scores.sort((a, b) => {
        if (a.scoreData.wpm !== b.scoreData.wpm) {
            return b.scoreData.wpm - a.scoreData.wpm; // Higher wpm first
        }
        return b.scoreData.accuracy - a.scoreData.accuracy; // Higher accuracy in case of a tie
    });
}

// Calculates the score for 'guesses_correct_total' logic.
function calculateGuessesCorrectTotal(score: StoredPokemonScore, penaltyFactor = 1.1) {
    const { correct, total } = score;
    return correct * Math.pow(correct / total, penaltyFactor);
}

export async function applyStrike(userId: string | undefined): Promise<string | undefined> {
    // TODO: give the user guest session a strike
    if (!userId) return;

    try {
        // Increment strikes and fetch the updated user
        const user = await User.findByIdAndUpdate(
            userId,
            { $inc: { strikes: 1 } },
            { new: true }, // return the updated document
        );

        if (!user) {
            console.log(`User ${userId} not found when applying strike.`);
            return;
        }

        // If strikes reach 3 or more, ban the user
        if (user.strikes >= 3 && user.status !== 'banned') {
            user.status = 'banned';
            await user.save();

            console.log(`User ${user.nickname} (${user._id}) has been banned due to 3 strikes.`);
            return 'You have been banned for 3 strikes.';
        }

        return 'You have been given a strike.';
    } catch (error) {
        console.error('Failed to apply strike:', error);
    }
}
