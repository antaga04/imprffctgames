import GameSession from '@/api/models/gameSession';

export const validatePokemonScoreData = async (
    scoreData: PokemonScoreData,
): Promise<{ isValid: boolean; newScore: any }> => {
    try {
        const { gameSessionId } = scoreData;
        const session = await GameSession.findById(gameSessionId);

        if (!session) {
            throw new Error('Game session not found');
        }

        if (!session.validatedResults) {
            throw new Error('No validated results found for this session');
        }

        const flaggedAsBot = session.validatedResults.flaggedAsBot.length > 0 || false;

        if (flaggedAsBot) {
            throw new Error(
                'Session flagged as bot: ' +
                    session.validatedResults.flaggedAsBot.map((a: { reason: string }) => a.reason).join(', '),
            );
        }

        return { isValid: true, newScore: session.validatedResults };
    } catch (error) {
        console.error('Error validating Pokémon score: ', error);
        return { isValid: false, newScore: null };
    }
};
