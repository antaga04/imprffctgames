interface PokemonBasic {
    name: string;
    url: string;
    id: number;
}

interface PokemonDetails {
    pokeId: number;
    name: string;
    sprites: {
        default: string;
        artwork: string;
    };
}

interface PokemonSprite {
    color: string;
    gray: string;
}

interface PokemonSeedData {
    pokeId: number;
    name: string;
    sprite: PokemonSprite;
}

interface FallbackUrls {
    [pokeId: number]: { color: string; gray: string };
}
