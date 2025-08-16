import axios from 'axios';

export async function fetchPokemonList(limit = 151): Promise<PokemonBasic[]> {
    const res = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);
    return res.data.results.map((p: any, idx: number) => ({
        name: p.name,
        url: p.url,
        id: idx + 1,
    }));
}

export async function fetchPokemonDetails(pokeId: number): Promise<PokemonDetails> {
    const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokeId}`);
    const data = res.data;
    return {
        pokeId: pokeId,
        name: data.name,
        sprites: {
            default: data.sprites.front_default,
            artwork: data.sprites.other['official-artwork'].front_default,
        },
    };
}
