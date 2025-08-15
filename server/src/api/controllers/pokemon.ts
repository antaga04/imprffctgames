import { Request, Response } from 'express';
import Pokemon from '@/models/pokemon';
import GameSession from '@/models/gameSession';
import { getRandomSequence } from '@/utils/randomSequence';
import { PokemonSchema } from '@/types/model';
import { sendError, sendSuccess } from '@/utils/response';
import { applyStrike } from '@/utils/scoreUtils';

// POST /pokemon - Generate the random Pokémon sequence for the session
export const generatePokemonSession = async (req: Request, res: Response) => {
    try {
        const sequence = getRandomSequence(1, 151, 55);

        const newSession = new GameSession({
            game_id: process.env.POKEMON_ID,
            state: sequence,
            session_expiry: new Date(Date.now() + 5 * 60 * 1000),
        });

        await newSession.save();

        const pokeIds = sequence.slice(0, 10).map(Number);
        const pokemons = [];

        for (const id of pokeIds) {
            const pokemon = await Pokemon.findOne({ pokeId: id }).lean();
            if (pokemon) {
                pokemons.push(pokemon);
            } else {
                console.warn(`Pokemon with pokeId ${id} not found!`);
            }
        }

        const firstBatchData = pokemons.map((pokemon) => {
            return {
                _id: pokemon._id,
                nameLength: pokemon.name.length,
                sprite: pokemon.sprite,
            };
        });

        return sendSuccess(res, 200, {
            i18n: 'pokemon.session_created',
            message: 'Game session created successfully.',
            payload: {
                gameSessionId: newSession._id,
                pokemons: firstBatchData,
            },
        });
    } catch (error) {
        console.error('[generatePokemonSession]: Error:', error);
        return sendError(res, 500, {
            i18n: 'pokemon.session_creation_failed',
            message: 'Failed to create Pokémon session.',
        });
    }
};

// GET /:gameSessionId/:batchNumber - Fetch additional Pokémon batches for the user
export const getPokemonBatch = async (req: Request, res: Response) => {
    try {
        const { gameSessionId, batchNumber } = req.params;
        // TODO: Add anticheat validation for previous batch. include in the front the data like keystrokes, etc?

        const batchNum = parseInt(batchNumber, 10);
        if (isNaN(batchNum) || batchNum < 2) {
            return sendError(res, 400, {
                i18n: 'pokemon.invalid_batch_number',
                message: 'Invalid batch number provided.',
            });
        }

        const session = await GameSession.findById(gameSessionId);

        if (!session) {
            return sendError(res, 404, {
                i18n: 'pokemon.session_not_found',
                message: 'Game session not found.',
            });
        }

        const sequence = session.state;
        const startIndex = (batchNum - 1) * 5;
        const endIndex = startIndex + 5;

        const pokemons = [];
        const pokeIds = sequence.slice(startIndex, endIndex).map(Number);
        for (const id of pokeIds) {
            const pokemon = await Pokemon.findOne({ pokeId: id }).lean();
            if (pokemon) {
                pokemons.push(pokemon);
            } else {
                console.warn(`Pokemon with pokeId ${id} not found!`);
            }
        }

        const batchData = pokemons.map((pokemon) => {
            return {
                _id: pokemon._id,
                nameLength: pokemon.name.length,
                sprite: pokemon.sprite,
            };
        });

        return sendSuccess(res, 200, {
            i18n: 'pokemon.batch_fetched',
            message: 'Batch of Pokémon fetched successfully.',
            payload: {
                pokemons: batchData,
            },
        });
    } catch (error) {
        console.error('[getPokemonBatch] Error:', error);
        return sendError(res, 500, {
            i18n: 'pokemon.batch_fetch_failed',
            message: 'Failed to fetch Pokémon batch.',
        });
    }
};

// POST /check-results - Check the user's guesses against the Pokémon sequence
export const checkPokemonResults = async (req: Request, res: Response) => {
    try {
        const { gameSessionId, guesses } = req.body as PokemonScoreData;
        const { id } = req.user ?? {};

        const session = await GameSession.findById(gameSessionId);
        if (!session) {
            return sendError(res, 404, {
                i18n: 'pokemon.session_not_found',
                message: 'Game session not found.',
            });
        }

        const bufferTime = 2500;
        const requiredGameDuration = 60000;
        const gameDuration = Date.now() - session.createdAt.getTime();

        if (gameDuration < requiredGameDuration) {
            await applyStrike(id);
            return sendError(res, 400, {
                i18n: 'pokemon.game_duration_too_short',
                message: 'Game duration is too short.',
            });
        }

        if (gameDuration > Date.now() + bufferTime) {
            await applyStrike(id);
            return sendError(res, 400, {
                i18n: 'pokemon.game_duration_exceeded',
                message: 'Game duration has exceeded the allowed time.',
            });
        }

        const sequence = session.state as number[];
        const pokeIds = sequence.slice(0, guesses.length).map(Number);
        const pokemons = await Pokemon.find({ pokeId: { $in: pokeIds } });

        // Map for quick lookup of Pokémon by pokeId
        const pokemonMap: Record<number, PokemonSchema> = pokemons.reduce(
            (map, pokemon) => {
                map[pokemon.pokeId] = pokemon;
                return map;
            },
            {} as Record<number, PokemonSchema>,
        );

        let correctGuesses = 0;
        let results = [];
        let flaggedAsBot = false;

        for (const guess of guesses) {
            const pokemon = pokemonMap[sequence[guesses.indexOf(guess)]];
            if (pokemon) {
                const correctName = pokemon.name.toLowerCase();
                const userGuess = guess.guess.toLowerCase();
                const keystrokeIntervals = guess.keystrokeTimes;

                const isCorrect = correctName === userGuess;
                if (isCorrect) correctGuesses += 1;

                if (keystrokeIntervals.length > 0) {
                    const minInterval = Math.min(...keystrokeIntervals);
                    const maxInterval = Math.max(...keystrokeIntervals);
                    const avgInterval =
                        keystrokeIntervals.reduce((a: number, b: number) => a + b, 0) / keystrokeIntervals.length;
                    const variance = maxInterval - minInterval;

                    const fastTyping = avgInterval < 50;
                    const lowVariance = variance < 5;
                    const unrealisticTotalTime = keystrokeIntervals.reduce((a: number, b: number) => a + b, 0) < 300;

                    if (fastTyping || lowVariance || unrealisticTotalTime) {
                        flaggedAsBot = true;
                    }
                }

                results.push({ guessedName: userGuess, correctName, isCorrect });
            }
        }

        session.validatedResults = {
            correct: correctGuesses,
            total: guesses.length,
            results,
            flaggedAsBot,
        };
        await session.save();

        const responseData = { ...session.validatedResults };

        if (flaggedAsBot) {
            await applyStrike(id);
        }

        return sendSuccess(res, 200, {
            i18n: 'pokemon.results_checked',
            message: 'Pokémon results checked successfully.',
            payload: responseData,
        });
    } catch (error) {
        console.error('[checkPokemonResults] Error:', error);
        return sendError(res, 500, {
            i18n: 'pokemon.results_check_failed',
            message: 'Failed to check Pokémon results.',
        });
    }
};
