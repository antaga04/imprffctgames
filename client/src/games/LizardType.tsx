import GameWrapper from '@/components/layouts/GameWrapper';
import CoolDownButton from '@/components/ui/CoolDownButton';
import Controls from '@/components/ui/lizardtype/Controls';
import DecrementTimer from '@/components/ui/Timers/DecrementTimer';
import { useGameCompletion } from '@/hooks/useCompletion';
import { useFetch } from '@/hooks/useFetch';
import { useTempScore } from '@/hooks/useTempScore';
import { LIZARDTYPE_SLUG } from '@/lib/constants';
import axios from 'axios';
import { Settings } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

const API_LIZARDTYPE_GAME_URL = `${import.meta.env.VITE_API_URL}/games/${LIZARDTYPE_SLUG}`;
const API_URL = import.meta.env.VITE_API_URL;

const Game: React.FC<{ game: GameSchema | null }> = ({ game }) => {
    const { t, i18n } = useTranslation();

    const [gameMode, setGameMode] = useState<LizardtypeGameMode>('15s');
    const [language, setLanguage] = useState<Language>(i18n.language);
    const [gameState, setGameState] = useState<LizardtypeGameState>('waiting');
    const [words, setWords] = useState<string[]>([]);
    const [typedWords, setTypedWords] = useState<string[]>([]);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [currentCharIndex, setCurrentCharIndex] = useState(0);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [gameSessionId, setGameSessionId] = useState<string | null>(null);
    const [resetSignal, setResetSignal] = useState(0);
    const [totalMistakes, setTotalMistakes] = useState(0);
    const [isFocused, setIsFocused] = useState(false);
    const [loading, setLoading] = useState(false);
    const [hash, setHash] = useState(null);
    const [stats, setStats] = useState<LizardtypeStats>({
        wpm: 0,
        accuracy: 0,
        correctChars: 0,
        totalChars: 0,
        totalMistakes: 0,
    });
    const hiddenInputRef = useRef<HTMLInputElement>(null);
    const gameDuration = gameMode.slice(0, -1) as unknown as number;

    const { setTempScore } = useTempScore();
    const handleCompletion = useGameCompletion(game?._id, LIZARDTYPE_SLUG);

    const generateGame = useCallback(async () => {
        try {
            const response = await axios.post(`${API_URL}/lizardtype`, {
                withCredentials: true,
                language,
                variant: gameMode,
            });
            const { words, hash, gameSessionId } = response.data.payload;

            if (words && hash) {
                return {
                    newWords: words,
                    hash,
                    gameSessionId,
                };
            }
        } catch (error) {
            console.error('Error fetching board:', error);
            const err = error as MyError;
            toast.error(t(`server.${err.response?.data?.i18n}`) || t('games.lyzard.board_error'));
        } finally {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [language]);

    const resetGame = useCallback(async () => {
        setLoading(true);
        const gameSession = await generateGame().finally(() => setLoading(false));
        if (!gameSession) return;
        const { newWords, hash, gameSessionId } = gameSession;

        setWords(newWords);
        setHash(hash);
        setTypedWords([]);
        setCurrentWordIndex(0);
        setCurrentCharIndex(0);
        setStartTime(null);
        setGameState('waiting');
        setGameSessionId(gameSessionId);
        setResetSignal((prev) => prev + 1);
        setTotalMistakes(0);
        setStats({
            wpm: 0,
            accuracy: 0,
            correctChars: 0,
            totalChars: 0,
            totalMistakes: 0,
        });
        resetFocus();
    }, [generateGame]);

    useEffect(() => {
        resetGame();
    }, [resetGame]);

    const calculateStats = useCallback(() => {
        let correctChars = 0;
        let totalChars = 0;

        for (let wordIdx = 0; wordIdx < currentWordIndex; wordIdx++) {
            const word = words[wordIdx];
            const typedWord = typedWords[wordIdx] || '';

            for (let charIdx = 0; charIdx < word.length; charIdx++) {
                totalChars++;
                if (charIdx < typedWord.length && typedWord[charIdx] === word[charIdx]) {
                    correctChars++;
                }
            }
        }

        if (currentWordIndex < words.length) {
            const currentWord = words[currentWordIndex];
            const currentTypedWord = typedWords[currentWordIndex] || '';

            for (let charIdx = 0; charIdx < currentCharIndex; charIdx++) {
                totalChars++;
                if (charIdx < currentTypedWord.length && currentTypedWord[charIdx] === currentWord[charIdx]) {
                    correctChars++;
                }
            }
        }

        const accuracy = totalChars > 0 ? ((totalChars - totalMistakes) / totalChars) * 100 : 0;
        const timeElapsed = startTime ? (Date.now() - startTime) / 60000 : 0;
        const wordsTyped = correctChars / 5;
        const wpm = timeElapsed > 0 ? Math.round(wordsTyped / timeElapsed) : 0;

        return {
            wpm,
            accuracy: Math.round(Math.max(0, accuracy)),
            correctChars,
            totalChars,
            totalMistakes,
        };
    }, [typedWords, words, currentWordIndex, currentCharIndex, startTime, totalMistakes]);

    const onGameFinished = useCallback(() => {
        setGameState('finished');
        const gameStats = calculateStats();
        setStats(gameStats);

        if (!game || !gameSessionId || !hash) {
            return toast.error(t('games.not_found_db'));
        }
        const scoreData = { ...gameStats, hash, gameSessionId };
        setTempScore({ scoreData, gameId: game._id, slug: game.slug });
        handleCompletion(scoreData);
        // eslint-disable-next-line
    }, [calculateStats]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
            e.preventDefault();
            return;
        }

        if (e.key === 'Backspace' && (e.altKey || e.metaKey)) {
            e.preventDefault();
            if (currentWordIndex > 0 || currentCharIndex > 0) {
                if (currentCharIndex === 0 && currentWordIndex > 0) {
                    const newTypedWords = [...typedWords];
                    newTypedWords[currentWordIndex - 1] = '';
                    setTypedWords(newTypedWords);
                    setCurrentWordIndex((prev) => prev - 1);
                    setCurrentCharIndex(words[currentWordIndex - 1]?.length || 0);
                } else {
                    const newTypedWords = [...typedWords];
                    newTypedWords[currentWordIndex] = '';
                    setTypedWords(newTypedWords);
                    setCurrentCharIndex(0);
                }
            }
            return;
        }

        if (e.key === 'Backspace') {
            e.preventDefault();
            if (currentCharIndex > 0) {
                const newTypedWords = [...typedWords];
                const currentTyped = newTypedWords[currentWordIndex] || '';
                newTypedWords[currentWordIndex] = currentTyped.slice(0, -1);
                setTypedWords(newTypedWords);
                setCurrentCharIndex((prev) => prev - 1);
            } else if (currentWordIndex > 0) {
                setCurrentWordIndex((prev) => prev - 1);
                const prevWordTyped = typedWords[currentWordIndex - 1] || '';
                setCurrentCharIndex(prevWordTyped.length);
            }
            return;
        }

        if (e.key === ' ') {
            e.preventDefault();
            if (currentWordIndex < words.length - 1) {
                const currentTyped = typedWords[currentWordIndex] || '';
                const currentWord = words[currentWordIndex];
                if (currentTyped.length > currentWord.length) {
                    const extraChars = currentTyped.length - currentWord.length;
                    setTotalMistakes((prev) => prev + extraChars);
                }

                setCurrentWordIndex((prev) => prev + 1);
                setCurrentCharIndex(0);
            }
            return;
        }

        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
            if (gameState === 'waiting') {
                setGameState('playing');
                setStartTime(Date.now());
                // setGameSessionId(Date.now().toString());
            }

            if (gameState === 'playing' || gameState === 'waiting') {
                const newTypedWords = [...typedWords];
                const currentTyped = newTypedWords[currentWordIndex] || '';
                const currentWord = words[currentWordIndex];

                if (currentCharIndex < currentWord.length) {
                    const expectedChar = currentWord[currentCharIndex];
                    const typedChar = e.key;

                    // Normalize both characters for comparison (handles accents)
                    const normalizedExpected = expectedChar.normalize('NFD');
                    const normalizedTyped = typedChar.normalize('NFD');

                    if (normalizedExpected !== normalizedTyped && expectedChar !== typedChar) {
                        setTotalMistakes((prev) => prev + 1);
                    }
                } else {
                    setTotalMistakes((prev) => prev + 1);
                }

                newTypedWords[currentWordIndex] = currentTyped + e.key;
                setTypedWords(newTypedWords);
                setCurrentCharIndex((prev) => prev + 1);
            }
        }
    };

    const handleWordsClick = () => {
        if (hiddenInputRef.current) {
            hiddenInputRef.current.focus();
        }
    };

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    const resetFocus = () => {
        setIsFocused(false);
        if (hiddenInputRef.current) {
            hiddenInputRef.current.blur();
        }
    };

    const renderWords = () => {
        return words.slice(0, 50).map((word, wordIdx) => {
            const isCurrentWord = wordIdx === currentWordIndex;
            const isCompletedWord = wordIdx < currentWordIndex;
            const typedWord = typedWords[wordIdx] || '';

            return (
                <div key={wordIdx} className="inline-block mr-3 mb-2">
                    {word.split('').map((char, charIdx) => {
                        let className = 'transition-colors duration-75 ';

                        if (isCompletedWord || (isCurrentWord && charIdx < typedWord.length)) {
                            const expectedChar = char;
                            const typedChar = typedWord[charIdx];

                            // Normalize both characters for comparison
                            const normalizedExpected = expectedChar.normalize('NFD');
                            const normalizedTyped = typedChar ? typedChar.normalize('NFD') : '';

                            if (normalizedExpected === normalizedTyped || expectedChar === typedChar) {
                                className += 'text-green-400 bg-green-400/10';
                            } else {
                                className += 'text-red-400 bg-red-400/10';
                            }
                        } else if (isCurrentWord && charIdx === currentCharIndex) {
                            className += 'bg-yellow-400/30 animate-pulse text-yellow-600';
                        } else {
                            className += 'text-muted-foreground';
                        }

                        return (
                            <span key={charIdx} className={className}>
                                {char}
                            </span>
                        );
                    })}

                    {(isCurrentWord || isCompletedWord) && typedWord.length > word.length && (
                        <span className="text-red-400 bg-red-400/20 font-bold">{typedWord.slice(word.length)}</span>
                    )}

                    {isCurrentWord && currentCharIndex >= word.length && (
                        <span className="bg-yellow-400/30 animate-pulse"> </span>
                    )}
                </div>
            );
        });
    };

    return (
        <div className="w-full max-w-4xl space-y-8 mt-4">
            <div className="flex justify-center items-center gap-6">
                <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-400 font-mono">{t('globals.settings')}:</span>
                </div>

                <Controls
                    gameMode={gameMode}
                    setGameMode={setGameMode}
                    gameState={gameState}
                    resetGame={resetGame}
                    language={language}
                    setLanguage={setLanguage}
                    resetFocus={resetFocus}
                />
            </div>

            <div className="flex justify-center text-4xl font-bold font-mono">
                <DecrementTimer
                    initialTime={gameDuration}
                    onGameFinished={onGameFinished}
                    resetSignal={resetSignal}
                    gameSessionId={gameState === 'playing' ? gameSessionId : null}
                />
            </div>

            <div className="p-8 bg-slate-200 border border-black rounded-lg shadow-md">
                <div className="space-y-6">
                    <div
                        className={`relative min-h-[120px] rounded-lg p-4 transition-all duration-200 ${
                            isFocused ? 'ring-2 ring-green-400/50 bg-green-400/5' : 'hover:bg-gray-300/40'
                        }`}
                        onClick={handleWordsClick}
                    >
                        <div className="text-xl leading-relaxed font-mono text-left select-none">
                            {words.length > 0 ? (
                                renderWords()
                            ) : (
                                <div className="text-muted-foreground">
                                    {loading ? t('globals.loading') + '...' : t('games.lizardtype.no_words')}
                                </div>
                            )}
                        </div>

                        <input
                            ref={hiddenInputRef}
                            type="text"
                            value=""
                            onChange={() => {}} // Dummy handler to use onKeyDown
                            onKeyDown={handleKeyDown}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            disabled={gameState === 'finished'}
                            className="absolute opacity-0 pointer-events-none"
                            autoFocus
                            autoComplete="off"
                            autoCapitalize="off"
                            autoCorrect="off"
                            spellCheck="false"
                        />

                        {gameState === 'waiting' && !isFocused && (
                            <p className="absolute inset-0 text-black font-mono font-bold backdrop-blur-sm grid justify-items-center items-center cursor-default">
                                {loading ? t('globals.loading') : t('games.lizardtype.focus_text')}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-center gap-4">
                        <CoolDownButton
                            text={t('globals.reset')}
                            onSubmit={resetGame}
                            bgColor="bg-yellow-600"
                            hoverBgColor="hover:bg-yellow-700"
                            coolTime={2500}
                        />
                    </div>
                </div>
            </div>

            {gameState === 'finished' && (
                <div className="p-6 bg-gray-900 border border-gray-700 rounded-lg">
                    <div className="text-center space-y-4">
                        <h2 className="text-2xl font-bold text-white font-mono">{t('games.lizardtype.completed')}</h2>
                        <div className="grid grid-cols-2 gap-6 text-center">
                            <div>
                                <div className="text-4xl font-bold text-yellow-400 font-mono">{stats.wpm}</div>
                                <div className="text-sm text-gray-400 capitalize">{t('globals.wpm')}</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-white font-mono">{stats.accuracy}%</div>
                                <div className="text-sm text-gray-400">{t('globals.accuracy')}</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const LizardType: React.FC = () => {
    const { data: game } = useFetch<GameSchema>(API_LIZARDTYPE_GAME_URL);
    const { t } = useTranslation();

    return (
        <GameWrapper title={t('games.lizardtype.name')} instructions={t('games.lizardtype.instructions')}>
            <Game game={game} />
        </GameWrapper>
    );
};

export default LizardType;
