import mongoose from 'mongoose';

const pokemonSchema = new mongoose.Schema({
    pokeId: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    sprite: { type: String, required: true },
});

const Pokemon = mongoose.model('Pokemon', pokemonSchema, 'Pokemon');

export default Pokemon;
