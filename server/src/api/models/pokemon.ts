import { PokemonSchema } from '@/types/model';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const pokemonSchema = new mongoose.Schema<PokemonSchema>({
    _id: { type: String, default: () => uuidv4() },
    pokeId: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    sprite: {
        color: { type: String },
        gray: { type: String },
    },
});

const Pokemon = mongoose.model<PokemonSchema>('Pokemon', pokemonSchema, 'Pokemon');

export default Pokemon;
