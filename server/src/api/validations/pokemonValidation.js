/* export function validatePokemonScoreData(scoreData) {
    const { correct, total } = scoreData;
    console.log('# pokemon validation');

    return (
        typeof correct === 'number' &&
        typeof total === 'number' &&
        correct >= 0 &&
        total > 0 &&
        correct <= total &&
        total < 54
    );
} */

import GameSession from '../models/gameSession.js';

export const validatePokemonScoreData = async (scoreData) => {
    try {
        const { gameSessionId } = scoreData;
        const session = await GameSession.findById(gameSessionId);

        if (!session) {
            throw new Error('Game session not found');
        }

        if (!session.validatedResults) {
            return { isValid: false, newScore: null };
        }

        const flaggedAsBot = session.validatedResults.flaggedAsBot || false;

        if (flaggedAsBot) {
            return { isValid: false, newScore: null };
        }

        return { isValid: true, newScore: session.validatedResults };
    } catch (error) {
        console.error('Error validating Pokémon score:', error);
        return { isValid: false, newScore: null };
    }
};
