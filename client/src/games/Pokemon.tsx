import { useState, useEffect, useRef } from 'react';
import Confetti from 'react-confetti';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import GameWrapper from '@/components/layouts/GameWrapper';
import CoolDownButton from '@/components/ui/CoolDownButton';
import { useGameCompletion } from '@/hooks/useCompletion';
import { useTempScore } from '@/hooks/useTempScore';
import axios from 'axios';

const INITIAL_TIME = 60;
const GAME_ID = import.meta.env.VITE_POKEMON_ID;

const Feedback: React.FC<Feedback> = ({ correct, guess }) => {
    const correctArray = correct.split('');
    const guessArray = guess.split('');

    const feedback = correctArray.map((char, index) => {
        const guessedChar = guessArray[index];

        if (guessedChar === char) {
            return (
                <span key={index} className="text-green-500">
                    {char}
                </span>
            );
        } else if (guessedChar !== undefined) {
            return (
                <span key={index} className="text-red-500 underline">
                    {guessedChar}
                </span>
            );
        } else {
            return (
                <span key={index} className="text-gray-500">
                    _
                </span>
            );
        }
    });

    return (
        <div className="flex flex-col gap-2">
            <span className="text-base text-green-500">{correct}</span>
            <span className="text-base">{feedback}</span>
        </div>
    );
};

const DecrementTimer: React.FC<DecrementTimerProps> = ({ onGameFinished, resetSignal, gameSessionId }) => {
    const [timeLeft, setTimeLeft] = useState<number>(INITIAL_TIME);

    useEffect(() => {
        setTimeLeft(INITIAL_TIME);

        if (!gameSessionId) {
            return;
        }

        const interval = setInterval(() => {
            setTimeLeft((prevTime) => Math.max(prevTime - 1, 0));
        }, 1000);

        return () => clearInterval(interval);
    }, [resetSignal, gameSessionId]);

    useEffect(() => {
        if (timeLeft === 0) {
            onGameFinished();
        }
    }, [timeLeft, onGameFinished]);

    const timeColorClass = timeLeft < 11 ? 'text-red-600' : 'text-white';

    return (
        <p className="font-mono min-w-[6ch] text-right">
            Time: <span className={`font-mono ${timeColorClass}`}>{String(timeLeft).padStart(2, '0')}s</span>
        </p>
    );
};

// Input Component for Pokémon Name
const PokemonInput: React.FC<PokemonInputProps> = ({ nameLength, onSubmit }) => {
    const [input, setInput] = useState<string>('');
    const [keystrokeTimes, setKeystrokeTimes] = useState<number[]>([]);

    const lastSubmitTimeRef = useRef<number>(0);

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        const now = Date.now();

        if (event.key === 'Enter') {
            if (now - lastSubmitTimeRef.current < 1000) return;

            lastSubmitTimeRef.current = now;
            const keyIntervals = keystrokeTimes.map((time, i, arr) => (i > 0 ? time - arr[i - 1] : 0)).slice(1);

            onSubmit(input, keyIntervals);
            setInput('');
            setKeystrokeTimes([]);
        } else if (event.key.length === 1) {
            setKeystrokeTimes((prev) => [...prev, now]);
        }
    };

    const handleOnSubmit = () => {
        const keyIntervals = keystrokeTimes.map((time, i, arr) => (i > 0 ? time - arr[i - 1] : 0)).slice(1);

        onSubmit(input, keyIntervals);
        setInput('');
        setKeystrokeTimes([]);
    };

    const renderInputGroups = () => {
        const nameParts = Array(nameLength).fill('');
        return (
            <InputOTPGroup>
                {nameParts.map((_, index) => (
                    <InputOTPSlot key={index} index={index} className="font-bold" />
                ))}
            </InputOTPGroup>
        );
    };

    return (
        <>
            <InputOTP
                maxLength={nameLength}
                value={input}
                inputMode="text"
                onChange={(val: string) => setInput(val)}
                onKeyDown={handleKeyPress}
            >
                {renderInputGroups()}
            </InputOTP>
            <CoolDownButton
                text="Submit"
                onSubmit={handleOnSubmit}
                bgColor="bg-green-600"
                hoverBgColor="hover:bg-green-700"
                className="mt-6 mb-2"
            />
        </>
    );
};

const Game: React.FC = () => {
    const [gameSessionId, setGameSessionId] = useState(null);
    const [pokemonData, setPokemonData] = useState<PokemonData[]>([]);
    const [guesses, setGuesses] = useState<Guess[]>([]);
    const [batchNumber, setBatchNumber] = useState(3);
    const [currentPokemonIndex, setCurrentPokemonIndex] = useState(0);
    const [results, setResults] = useState<Results | null>(null);
    const [gameOver, setGameOver] = useState(false);
    const [playAgainKey, setPlayAgainKey] = useState(0);
    const [loading, setLoading] = useState(false);
    const [checkingResults, setCheckingResults] = useState(false);

    const { setTempScore } = useTempScore();
    const handleCompletion = useGameCompletion(GAME_ID);
    const hasHandledCompletion = useRef(false);

    const fetchInitialPokemons = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/pokemon`);
            const { gameSessionId, pokemons } = response.data;

            console.log(gameSessionId);

            setPokemonData(pokemons);
            setGameSessionId(gameSessionId);
        } catch (error) {
            console.error('Error fetching Pokémon data: ', error);
        }
        setLoading(false);
    };

    const fetchNewBatch = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/pokemon/${gameSessionId}/${batchNumber}`);
            const { pokemons } = response.data;
            setPokemonData((prev) => [...prev, ...pokemons]); // Append new batch
            setBatchNumber((prev) => prev + 1);
        } catch (error) {
            console.error('Error fetching Pokémon batch: ', error);
        }
    };

    useEffect(() => {
        fetchInitialPokemons();
    }, [playAgainKey]);

    const handleGuess = (guess: string, keystrokeTimes: number[]) => {
        const newGuess = {
            _id: pokemonData[currentPokemonIndex]._id.toString(),
            guess,
            keystrokeTimes,
        };

        setGuesses((prev) => [...prev, newGuess]);

        if (currentPokemonIndex === pokemonData.length - 2) {
            fetchNewBatch();
        }

        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setCurrentPokemonIndex((prev) => prev + 1);
        }, 100);
    };

    const handleGameOver = async () => {
        if (hasHandledCompletion.current) return;
        hasHandledCompletion.current = true;

        setGameOver(true);
        setCheckingResults(true);

        try {
            const scoreData = { guesses, gameSessionId };

            const response = await axios.post(`${import.meta.env.VITE_API_URL}/pokemon/results`, scoreData);

            setResults(response.data);
            setTempScore({ scoreData, gameId: GAME_ID });
            handleCompletion(scoreData);
        } catch (error) {
            console.error('Error fetching results:', error);
        }

        setCheckingResults(false);
    };

    const handlePlayAgain = () => {
        setGuesses([]);
        setGameOver(false);
        setPlayAgainKey((prev) => prev + 1);
        setCurrentPokemonIndex(0);
        setResults(null);
        hasHandledCompletion.current = false;
        setBatchNumber(3);
        setCheckingResults(false);
        setGameSessionId(null);
        setPokemonData([]);
    };

    return (
        <section className="flex flex-col justify-center items-center">
            {gameOver ? (
                <>
                    <Confetti recycle={false} numberOfPieces={200} />
                    <div className="inline-flex items-center justify-between min-w-[300px] h-12 gap-4 mb-3">
                        <CoolDownButton text="Play Again" onSubmit={handlePlayAgain} />
                        <h3 className="text-amber-400 text-2xl">Time's up!</h3>
                    </div>
                    {checkingResults ? (
                        <p className="text-white">Checking results...</p>
                    ) : (
                        <>
                            <h2 className="text-white text-2xl">
                                You guessed{' '}
                                <span className="devil-detail">
                                    {results?.correct}/{results?.total}
                                </span>{' '}
                                Pokémon!
                            </h2>
                            <div className="my-6 max-w-3xl mx-auto">
                                <div className="flex flex-wrap gap-4 mt-4 items-center justify-center">
                                    {results?.results.map((g, idx) =>
                                        g.isCorrect ? (
                                            <div
                                                key={idx}
                                                className="flex flex-col items-center border border-green-500 p-2 rounded relative"
                                            >
                                                <span className="absolute top-0 right-1 text-white text-sm">
                                                    {idx + 1}
                                                </span>
                                                <img
                                                    src={pokemonData[idx].sprite}
                                                    alt={g.guessedName}
                                                    className="w-20 h-20 object-contain"
                                                />
                                                <span className="text-green-500 text-base mt-2">{g.guessedName}</span>
                                            </div>
                                        ) : (
                                            <div
                                                key={idx}
                                                className="flex flex-col items-center border border-red-500 p-2 rounded relative"
                                            >
                                                <span className="absolute top-0 right-1 text-white text-sm">
                                                    {idx + 1}
                                                </span>
                                                <img
                                                    src={pokemonData[idx].sprite}
                                                    alt={g.correctName}
                                                    className="w-20 h-20 object-contain"
                                                />
                                                <Feedback correct={g.correctName} guess={g.guessedName} />
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </>
            ) : (
                <>
                    <div className="inline-flex items-center justify-between h-12 gap-4 mb-3">
                        <CoolDownButton text="Play Again" onSubmit={handlePlayAgain} />
                        <div className="flex flex-col text-white">
                            <DecrementTimer
                                onGameFinished={handleGameOver}
                                resetSignal={playAgainKey}
                                gameSessionId={gameSessionId}
                            />
                            <div className="flex justify-between gap-4 items-center">
                                <span className="font-mono min-w-[6ch] text-right">
                                    {String(guesses.length).padStart(2, '0')}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="relative md:w-64 md:h-64 w-52 h-52">
                        {loading ? (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <p className="text-white">Loading...</p>
                            </div>
                        ) : (
                            <img
                                src={pokemonData[currentPokemonIndex]?.sprite || ''}
                                alt="Who's that Pokémon?"
                                className="w-full h-full object-cover filter grayscale select-none"
                                draggable="false"
                            />
                        )}
                    </div>
                    <PokemonInput
                        nameLength={pokemonData[currentPokemonIndex]?.nameLength || 0}
                        onSubmit={handleGuess}
                    />
                </>
            )}
        </section>
    );
};

// Main Pokemon Game Component
const PokemonGame: React.FC = () => {
    console.log(
        '%cHey, you! %cI see you peeking around the DevTools... %cNo cheating allowed! ☝️🤓',
        'color: darkorange; font-size: 16px; font-weight: bold;',
        'color: limegreen; font-size: 16px; font-weight: bold;',
        'color: red; font-size: 16px; font-weight: bold; text-decoration: underline;',
    );

    return (
        <GameWrapper
            title="Who's that Pokémon?"
            height="479px"
            instructions={`Guess as many Pokémon as you can in ${INITIAL_TIME} seconds.`}
        >
            <Game />
        </GameWrapper>
    );
};

export default PokemonGame;
