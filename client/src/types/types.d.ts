/* --------------- Auth --------------- */
interface AuthState {
    isAuthenticated: boolean;
    loading: boolean;
}

interface AuthContextProps extends AuthState {
    login: (email: string, password: string) => Promise<void>;
    register: (nickname: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

interface DecodedToken {
    exp: number;
}

interface AuthUser {
    _id: string;
    nickname: string;
    email: string;
    scores: ScoreDataGeneric[];
    role: string;
    __v: number;
    avatar: string;
}

/* --------------- Components --------------- */
type ProfileData = {
    nickname: string;
    email: string;
    currentPassword: string;
    newPassword: string;
    avatar: string | null;
    scores: Score[];
};

type MyAvatarProps = {
    url: string;
    alt: string;
    width: string;
    height: string;
};

type AuthInputProps = {
    label: string;
    name: string;
    type: string;
    placeholder: string;
    Icon: React.FC<React.SVGProps<SVGSVGElement>>;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isPassword?: boolean;
    disabled?: boolean;
    focusOnMount?: React.RefObject<HTMLInputElement>;
};

type AuthLinkSwitcherTypes = {
    text: string;
    url: string;
    anchor: string;
};

type CoolDownButtonProps = {
    text: string | React.ReactNode;
    onSubmit: () => void;
    bgColor?: string;
    hoverBgColor?: string;
    textColor?: string;
    className?: string;
    coolTime?: number;
    title?: string;
};

type SingOutProps = {
    handleLogout: () => void;
};

type SocialLinkProps = {
    name: string;
    link: string;
};

type AvatarUploaderProps = {
    currentAvatar: string | null;
    profileData: ProfileData;
    setProfileData: (data: ProfileData | ((prevData: ProfileData) => ProfileData)) => void;
};

type ProfileFormProps = {
    profileData: ProfileData;
    setProfileData: React.Dispatch<React.SetStateAction<ProfileData>>;
};

type LoginFromData = {
    email: string;
    password: string;
};

type RegisterFormData = {
    nickname: string;
    email: string;
    password: string;
    confirmPassword: string;
};

type FromTabProps = {
    inputs: {
        label: string;
        name: string;
        type: string;
        placeholder: string;
        Icon: React.FC<React.SVGProps<SVGSVGElement>>;
    }[];
    profileData: ProfileData;
};

type ProfileFields = {
    nickname: string;
    email: string;
    password: string;
    newPassword: string;
    confirmPassword: string;
};

type EditButtonsProps = {
    handleCancel: () => void;
    loading: boolean;
    isEdited: boolean;
};

type AccountFields = {
    nickname: string;
    email: string;
};
/* --------------- Pokemon --------------- */
interface TimerDecrementProps {
    duration: number;
    onExpire: () => void;
}

interface PokemonInputProps {
    nameLength: number;
    onSubmit: (input: string, keyIntervals: number[]) => void;
}

interface PokemonData {
    _id: number;
    nameLength: number;
    sprite: string;
}

interface GameStats {
    guesses: {
        pokemon: PokemonData;
        correct: boolean;
        guess: string;
    }[];
}

/* --------------- Ranking --------------- */
interface Score {
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

interface Game {
    gameId: string;
    gameName: string;
}

interface PaginationInfo {
    currentPage: number;
    totalPages: number;
    totalItems: number;
}

/* --------------- Games --------------- */
type GameWrapperProps = {
    children: React.ReactNode;
    title: string;
    height?: string;
    instructions?: string;
};

type TimerIncrementProps = {
    isRunning: boolean;
    gameStarted: boolean;
    resetSignal: number; // Incremented to trigger a reset in the Timer
    onGameFinish: (time: number) => void; // Callback to pass time back to Game component
};

type DecrementTimerProps = {
    onGameFinished: () => void;
    resetSignal: number;
    gameSessionId: string | null; // Used to start the decrement timer
};

type GameItemProps = {
    link: string;
    name: string;
    thumbnail: string;
};

type Player = 'X' | 'O';
type Board = (Player | null)[];
type GameMode = 'single' | 'multi';
type GameStatus = 'playing' | 'won' | 'draw';
type WinnerResult = { player: Player; combination: number[] } | null;

type Feedback = {
    correct: string;
    guess: string;
};

/* --------------- TempScore --------------- */
type TempScoreData = {
    scoreData: ScoreData;
    gameId: string;
};

type TempScoreContextType = {
    tempScore?: TempScoreData;
    setTempScore: (data: TempScoreData) => void;
    clearTempScore: () => void;
};

/* --------------- Scores --------------- */
type ScoreData = {
    correct?: number;
    total?: number;
    guesses?: Guess[];
    moves?: Move[];
    time?: number;
};

type ScoreDataGeneric = {
    [key: string]: number | undefined;
};

interface Move {
    from: number;
    to: number;
    timestamp: number; // Timestamp in seconds
}

interface Guess {
    _id: string;
    guess: string;
}

interface Results {
    isValid: boolean;
    correct: number;
    total: number;
    results: Result[];
}

interface Result {
    guessedName: string;
    correctName: string;
    isCorrect: boolean;
}

/* --------------- Error --------------- */
interface MyError {
    response?: {
        data?: {
            error?: string;
        };
        status?: number;
    };
    message?: string;
}
