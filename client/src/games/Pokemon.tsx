import { useState, useEffect, useRef } from 'react';
import Confetti from 'react-confetti';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import GameWrapper from '@/components/layouts/GameWrapper';
import { PokemonInputProps, PokemonData, GameStats } from '@/types/types';
import { uploadScore } from '@/services/uploadScore';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import CoolDownButton from '@/components/ui/CoolDownButton';

const usedIds = new Set<number>(); // Set to track used IDs to avoid duplicates

// Input Component for Pokémon Name
const PokemonInput: React.FC<PokemonInputProps> = ({ nameLength, onSubmit }) => {
    const [input, setInput] = useState<string>('');

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && input.length === nameLength) {
            onSubmit(input);
            setInput('');
        }
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

    const handleOnSubmit = () => {
        onSubmit(input);
        setInput('');
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
    const [pokemonData, setPokemonData] = useState<PokemonData | null>(null);
    const [gameStats, setGameStats] = useState<GameStats>({ guesses: [] });
    const [showConfetti, setShowConfetti] = useState<boolean>(false);
    const [gameOver, setGameOver] = useState<boolean>(false);
    const [totalPokemonPresented, setTotalPokemonPresented] = useState<number>(0);
    const [playAgainKey, setPlayAgainKey] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const { user } = useAuth();
    const [timeLeft, setTimeLeft] = useState<number>(60);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const pokemonCache = useRef<Record<number, PokemonData>>({});

    const fetchPokemon = async () => {
        setLoading(true);

        let randomId;

        do {
            randomId = Math.floor(Math.random() * 151) + 1;
        } while (usedIds.has(randomId));

        usedIds.add(randomId);

        if (pokemonCache.current[randomId]) {
            setPokemonData(pokemonCache.current[randomId]);
        } else {
            try {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
                const data = await response.json();
                const newPokemon: PokemonData = {
                    id: randomId,
                    name: data.name.toLowerCase(),
                    image: data.sprites.other['official-artwork'].front_default,
                };
                pokemonCache.current[randomId] = newPokemon;
                setPokemonData(newPokemon);
            } catch (error) {
                console.error('Error fetching Pokémon data:', error);
            }
        }

        setTotalPokemonPresented((prev) => prev + 1);
        setLoading(false);
    };

    useEffect(() => {
        if (timeLeft <= 0) {
            handleGameOver();
            return;
        }
        intervalRef.current = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
        return () => clearInterval(intervalRef.current!);
    }, [timeLeft]);

    useEffect(() => {
        fetchPokemon();
    }, [playAgainKey]);

    const handleGuess = (guess: string) => {
        if (!pokemonData) return;

        const isCorrect = guess.toLocaleLowerCase() === pokemonData.name;

        setGameStats((prevStats) => ({
            guesses: [
                ...prevStats.guesses,
                {
                    pokemon: pokemonData,
                    correct: isCorrect,
                },
            ],
        }));

        fetchPokemon();
    };

    const handleGameOver = async () => {
        setGameOver(true);
        setShowConfetti(true);

        const correct = gameStats.guesses.filter((g) => g.correct).length;
        const total = totalPokemonPresented;

        const scoreData = { correct, total };
        const gameId = import.meta.env.VITE_POKEMON_ID;

        if (user) {
            const loadingToastId = toast.loading('Uploading score...');

            try {
                const response = await uploadScore(scoreData, gameId);
                const { message, data } = response.data;

                toast.dismiss(loadingToastId);

                if (response.status === 200) {
                    toast.warning(`${message}. Previous score: ${data.scoreData.correct}/${data.scoreData.total}`);
                } else if (response.status === 201) {
                    toast.success(`${message}. New score: Moves: ${data.scoreData.correct}/${data.scoreData.total}`);
                } else {
                    toast.error(response.data.error);
                }
            } catch (error) {
                console.error('Error uploading score:', error);
                toast.dismiss(loadingToastId);
                toast.error('Error uploading score.');
            }
        }
    };

    const handlePlayAgain = () => {
        setTimeLeft(60);
        setGameStats({ guesses: [] });
        setShowConfetti(false);
        setGameOver(false);
        setTotalPokemonPresented(0);
        setPlayAgainKey((prev) => prev + 1);
    };

    return (
        <section className="flex flex-col justify-center items-center">
            {showConfetti && <Confetti recycle={false} numberOfPieces={300} />}
            {gameOver ? (
                <>
                    <div className="inline-flex items-center justify-between min-w-[300px] h-12 gap-4 mb-3">
                        <CoolDownButton text="Play Again" onSubmit={handlePlayAgain} />
                        <h3 className="text-amber-400 text-2xl">Time's up!</h3>
                    </div>
                    <h2 className="text-white text-2xl">
                        You guessed{' '}
                        <span className="devil-detail">
                            {gameStats.guesses.map((g) => g.correct).filter(Boolean).length}/{totalPokemonPresented}
                        </span>{' '}
                        Pokémon!
                    </h2>
                    <div className="my-6 max-w-3xl mx-auto">
                        <div className="flex flex-wrap gap-4 mt-4 items-center justify-center">
                            {gameStats.guesses.map((g, idx) =>
                                g.correct ? (
                                    <div
                                        key={idx}
                                        className="flex flex-col items-center border border-green-500 p-2 rounded"
                                    >
                                        <img
                                            src={g.pokemon.image}
                                            alt={g.pokemon.name}
                                            className="w-20 h-20 object-contain"
                                        />
                                        <span className="text-green-500 text-base mt-2">{g.pokemon.name}</span>
                                    </div>
                                ) : (
                                    <div
                                        key={idx}
                                        className="flex flex-col items-center border border-red-500 p-2 rounded"
                                    >
                                        <img
                                            src={g.pokemon.image}
                                            alt={g.pokemon.name}
                                            className="w-20 h-20 object-contain"
                                        />
                                        <span className="text-red-500 text-base mt-2">{g.pokemon.name}</span>
                                    </div>
                                ),
                            )}
                            {pokemonData && (
                                <div className="flex flex-col items-center border border-white p-2 rounded">
                                    <img
                                        src={pokemonData.image}
                                        alt={pokemonData.name}
                                        className="w-20 h-20 object-contain"
                                    />
                                    <span className="text-white text-base mt-2">{pokemonData.name}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="inline-flex items-center justify-between h-12 gap-4 mb-3">
                        <CoolDownButton text="Play Again" onSubmit={handlePlayAgain} />
                        <div className="flex flex-col text-white">
                            <p className="font-mono min-w-[6ch] text-right">
                                Time:{' '}
                                <span className={`font-mono ${timeLeft < 11 ? 'text-red-600' : 'text-white'}`}>
                                    {String(timeLeft).padStart(2, '0')}s
                                </span>
                            </p>

                            <div className="flex justify-between gap-4 items-center">
                                <div
                                    className={`w-3 h-3 rounded-full ${
                                        gameStats.guesses.some((g) => g.pokemon.id === pokemonData?.id)
                                            ? gameStats.guesses.find((g) => g.pokemon.id === pokemonData?.id)?.correct
                                                ? 'bg-green-500'
                                                : 'bg-red-500'
                                            : 'bg-transparent'
                                    }`}
                                ></div>
                                <span className="font-mono min-w-[6ch] text-right">
                                    Correct:{' '}
                                    {String(gameStats.guesses.map((g) => g.correct).filter(Boolean).length).padStart(
                                        2,
                                        '0',
                                    )}
                                    /{String(totalPokemonPresented).padStart(2, '0')}
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
                                src={pokemonData?.image}
                                alt="Who's that Pokémon?"
                                className="w-full h-full object-cover filter grayscale select-none"
                                draggable="false"
                            />
                        )}
                    </div>
                    <PokemonInput nameLength={pokemonData?.name.replace(' ', '').length || 6} onSubmit={handleGuess} />
                </>
            )}
        </section>
    );
};

// Main Pokemon Game Component
const PokemonGame: React.FC = () => {
    console.log(
        '%cHey, you! %cI see you peeking around the DevTools... %cNo cheating allowed! 😎',
        'color: darkorange; font-size: 16px; font-weight: bold;',
        'color: limegreen; font-size: 16px; font-weight: bold;',
        'color: red; font-size: 16px; font-weight: bold; text-decoration: underline;',
    );

    return (
        <GameWrapper title="Who's that Pokémon?" height="479px">
            <Game />
        </GameWrapper>
    );
};

export default PokemonGame;
