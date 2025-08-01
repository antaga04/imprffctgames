import { Types } from 'mongoose';

export interface ScoreDocument extends Document {
    user_id: Types.ObjectId;
    game_id: Types.ObjectId;
    scoreData: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}

export interface PokemonSchema extends Document {
    pokeId: number;
    name: string;
    sprite: string;
}

export interface UserSchema extends Document {
    _id: Types.ObjectId;
    nickname: string;
    email: string;
    password: string;
    avatar?: string;
    scores: Types.ObjectId[];
    role: 'user' | 'admin';
    status: 'pending' | 'active' | 'banned';
    strikes: number;
}

export const SCORING_TYPES = ['guesses_correct_total', 'moves_time'] as const;
export const GAME_TYPES = ['quiz', 'puzzle', 'word_game', 'memory_game'] as const;

export type ScoringLogic = (typeof SCORING_TYPES)[number];
export type GameType = (typeof GAME_TYPES)[number];

export interface GameSchema extends Document {
    name: string;
    difficulty: number;
    type: GameType;
    cover?: string;
    scoringLogic: ScoringLogic;
}

export interface GameSessionSchema extends Document {
    game_id: Types.ObjectId;
    user_id: Types.ObjectId;
    hash?: string;
    state: Types.Array<any>;
    validatedResults?: Record<string, any> | null;
    session_expiry: Date;
    createdAt: Date;
    updatedAt: Date;
}
