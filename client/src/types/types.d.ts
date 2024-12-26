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
    scores: any[];
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

/* --------------- Pokemon --------------- */
export interface TimerProps {
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
