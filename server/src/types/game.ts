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
