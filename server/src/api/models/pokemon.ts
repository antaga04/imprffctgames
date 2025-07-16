import { PokemonSchema } from '@/types/model';
import mongoose from 'mongoose';

const pokemonSchema = new mongoose.Schema<PokemonSchema>({
    pokeId: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    sprite: { type: String, required: true },
});

const Pokemon = mongoose.model<PokemonSchema>('Pokemon', pokemonSchema, 'Pokemon');

export default Pokemon;
