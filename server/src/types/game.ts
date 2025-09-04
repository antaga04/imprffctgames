type Puzzle15Board = number[];

type Puzzle15ScoreData = {
    moves: Array<any>;
    time: number;
    gameSessionId: string;
    hash: string;
};

type PokemonScoreData = {
    guesses: PokemonGuess[];
    gameSessionId: string;
};

type PokemonGuess = {
    _id: string;
    guess: string;
    keystrokeTimes: number[];
};

type StoredPuzzle15Score = {
    moves: number;
    time: number;
};

type StoredPokemonScore = {
    correct: number;
    total: number;
    flaggedAsBot: boolean;
    results: [
        {
            guessedName: string;
            correctName: boolean;
            isCorrect: boolean;
        },
    ];
};
type LizardtypeNewScore = {
    wpm: number;
    accuracy: number;
};

interface TypingMetrics {
    wpm: number; // total number of characters in the correctly typed words (not including spaces)
    raw: number; // like wpm but with all keystrokes except special keys
    accuracy: number; // percentage of correct keystrokes
    consistency: number; // spacing between keystrokes
    correct: number; // correct characters of the end result
    incorrect: number; // incorrect characters of the end result
    hits: number; // correct characters that were typed
    mistakes: number; // mistakes made during typing
    missed: number; // mistakes made during typing
}

/* front */
interface LizardtypeStats {
    wpm: number;
    accuracy: number;
    correctChars: number;
    totalChars: number;
    totalMistakes: number;
}

interface LizardtypeScore extends LizardtypeStats {
    hash: string;
    gameSessionId: string | null;
    keystrokes: KeystrokeData[];
    variant: string;
}

type KeystrokeData = {
    key: string;
    timestamp: number;
    duration?: number;
    spacing?: number;
};
