type Puzzle15Board = number[];

type PokemonScore = {
    game_id: string;
    scoreData: PokemonScoreData;
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

type Puzzle15SubmittedScore = {
    moves: Array<any>;
    time: number;
    gameSessionId: string;
    hash: string;
};
