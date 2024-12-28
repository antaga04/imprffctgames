import { useState, useEffect, useRef } from 'react';
import Confetti from 'react-confetti';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import GameWrapper from '@/components/layouts/GameWrapper';
import { PokemonInputProps, PokemonData, GameStats, TimerDecrementProps } from '@/types/types';
import { uploadScore } from '@/services/uploadScore';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const Timer: React.FC<TimerDecrementProps> = ({ duration, onExpire }) => {
    const [timeLeft, setTimeLeft] = useState<number>(duration);

    useEffect(() => {
        if (timeLeft <= 0) {
            onExpire();
            return;
        }
        const interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
        return () => clearInterval(interval);
    }, [timeLeft, onExpire]);

    return <div className="text-white mb-2">Time Left: {timeLeft}s</div>;
};

// Input Component for Pokémon Name
const PokemonInput: React.FC<PokemonInputProps> = ({ nameLength, onSubmit }) => {
    const [input, setInput] = useState<string>('');

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && input.length === nameLength) {
            onSubmit(input);
            setInput(''); // Clear input after submission
        }
    };

    const renderInputGroups = () => {
        const nameParts = Array(nameLength).fill(''); // Simulate name slots
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
                onChange={(val: string) => setInput(val)}
                onKeyDown={handleKeyPress}
            >
                {renderInputGroups()}
            </InputOTP>
            <button
                onClick={() => {
                    onSubmit(input);
                    setInput('');
                }}
                className="mt-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
                Submit
            </button>
        </>
    );
};

// Main Pokemon Game Component
const PokemonGame: React.FC = () => {
    const [pokemonData, setPokemonData] = useState<PokemonData | null>(null);
    const [gameStats, setGameStats] = useState<GameStats>({ guesses: [] });
    const [showConfetti, setShowConfetti] = useState<boolean>(false);
    const [gameOver, setGameOver] = useState<boolean>(false);
    const [totalPokemonPresented, setTotalPokemonPresented] = useState<number>(0);
    const [playAgainKey, setPlayAgainKey] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const { user } = useAuth();
    // const [guessStatus, setGuessStatus] = useState<'correct' | 'incorrect' | 'none'>('none');

    const pokemonCache = useRef<Record<number, PokemonData>>({});

    const fetchPokemon = async () => {
        setLoading(true);
        const randomId = Math.floor(Math.random() * 369) + 1;

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
        fetchPokemon();
    }, [playAgainKey]);

    const handleGuess = (guess: string) => {
        if (!pokemonData) return;

        const isCorrect = guess === pokemonData.name;
        // setGuessStatus(isCorrect ? 'correct' : 'incorrect');

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

    const handleGameOver = () => {
        setGameOver(true);
        setShowConfetti(true);

        const correct = gameStats.guesses.filter((g) => g.correct).length;
        const total = totalPokemonPresented;

        const scoreData = { correct, total };
        const gameId = '676f12b831fbdf3e1d79b16a';

        if (user) {
            try {
                toast.promise(uploadScore(scoreData, gameId), {
                    loading: 'Uploading score...',
                    success: 'Your score has been uploaded!',
                    error: (err) => err.response?.data?.error || 'Error uploading score.',
                });
            } catch (error) {
                console.error('Error uploading score:', error);
                throw new Error('Failed to upload score');
            }
        }
    };

    const handlePlayAgain = () => {
        setGameStats({ guesses: [] });
        setShowConfetti(false);
        setGameOver(false);
        setTotalPokemonPresented(0);
        setPlayAgainKey((prev) => prev + 1);
    };

    return (
        <GameWrapper title="Who's that Pokemon?" height="479px">
            <section className="flex flex-col justify-center items-center">
                {showConfetti && <Confetti recycle={false} numberOfPieces={300} />}
                {gameOver ? (
                    <>
                        <h3 className="text-amber-400 text-xl">Time's up!</h3>
                        <h2 className="text-white text-2xl">
                            You guessed{' '}
                            <span className="devil-detail">
                                {gameStats.guesses.map((g) => g.correct).filter(Boolean).length}/{totalPokemonPresented}
                            </span>{' '}
                            Pokemon!
                        </h2>
                        <div className="mt-6 max-w-3xl mx-auto">
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
                        <button
                            onClick={handlePlayAgain}
                            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Play Again
                        </button>
                    </>
                ) : (
                    <>
                        <Timer duration={60} onExpire={handleGameOver} />
                        <div className="text-white mb-2 flex items-center gap-2">
                            Correct Guesses: {gameStats.guesses.map((g) => g.correct).filter(Boolean).length}/
                            {totalPokemonPresented}
                            <div
                                className={`w-3 h-3 rounded-full ${
                                    gameStats.guesses.some((g) => g.pokemon.id === pokemonData?.id)
                                        ? gameStats.guesses.find((g) => g.pokemon.id === pokemonData?.id)?.correct
                                            ? 'bg-green-500'
                                            : 'bg-red-500'
                                        : 'bg-transparent'
                                } transition-opacity duration-500`}
                            ></div>
                        </div>
                        <div className="relative w-64 h-64">
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
                        <PokemonInput
                            nameLength={pokemonData?.name.replace(' ', '').length || 6}
                            onSubmit={handleGuess}
                        />
                    </>
                )}
            </section>
        </GameWrapper>
    );
};

export default PokemonGame;
