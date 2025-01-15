/* --------------- Auth --------------- */
export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    loading: boolean;
}

export interface AuthContextProps extends AuthState {
    login: (email: string, password: string) => Promise<void>;
    register: (nickname: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    updateUser: (user: User) => void;
}

export interface DecodedToken {
    exp: number;
}

export interface AuthUser {
    _id: string;
    nickname: string;
    email: string;
    scores: ScoreDataGeneric[];
    rol: string;
    __v: number;
    avatar: string;
}

/* --------------- Components --------------- */
export type ProfileData = {
    nickname: string;
    email: string;
    password: string;
    avatar: string;
};

type MyAvatarProps = {
    url: string;
    alt: string;
    width: string;
    height: string;
};

/* --------------- Pokemon --------------- */
export interface TimerDecrementProps {
    duration: number;
    onExpire: () => void;
}

export interface PokemonInputProps {
    nameLength: number;
    onSubmit: (input: string) => void;
}

export interface PokemonData {
    id: number;
    name: string;
    image: string;
}

export interface GameStats {
    guesses: { pokemon: PokemonData; correct: boolean }[];
}

/* --------------- Ranking --------------- */
export interface Score {
    _id: string;
    user_id: {
        _id: string;
        nickname: string;
        avatar: string;
    };
    game_id: {
        _id: string;
        name: string;
        cover: string;
    };
    scoreData: { [key: string]: number | undefined };
    createdAt: string;
    updatedAt: string;
}

export interface Game {
    gameId: string;
    gameName: string;
}

export interface PaginationInfo {
    currentPage: number;
    totalPages: number;
    totalItems: number;
}

/* --------------- Games --------------- */
type TimerIncrementProps = {
    isRunning: boolean;
    gameStarted: boolean;
    resetSignal: number; // Incremented to trigger a reset in the Timer
    setTime: React.Dispatch<React.SetStateAction<number>>; // Function to pass time back to Game component
};

/* --------------- Scores --------------- */
type ScoreData = {
    correct?: number;
    total?: number;
    moves?: number;
    time?: number;
};

type ScoreDataGeneric = {
    [key: string]: number | undefined;
};
