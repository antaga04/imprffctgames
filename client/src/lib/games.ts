export const games = {
    tictactoe: {
        name: 'Tic Tac Toe',
        url: 'tictactoe',
        thumbnail: 'https://res.cloudinary.com/drsfru9lj/image/upload/v1755299859/imprffctgames/games/tictactoe.webp',
        loader: () => import('@/games/TicTacToe').then((m) => m.default),
    },
    puzzle15: {
        name: '15 Puzzle',
        url: 'puzzle15',
        thumbnail: 'https://res.cloudinary.com/drsfru9lj/image/upload/v1755299856/imprffctgames/games/15puzzle.webp',
        loader: () => import('@/games/Puzzle15').then((m) => m.default),
    },
    pokemon: {
        name: "Who's that Pokémon",
        url: 'pokemon',
        thumbnail: 'https://res.cloudinary.com/drsfru9lj/image/upload/v1755299858/imprffctgames/games/pokemon.webp',
        loader: () => import('@/games/Pokemon').then((m) => m.default),
    },
    lizardtype: {
        name: 'Lizardtype',
        url: 'lizardtype',
        thumbnail: 'https://res.cloudinary.com/drsfru9lj/image/upload/v1755299857/imprffctgames/games/lizardtype.webp',
        loader: () => import('@/games/LizardType').then((m) => m.default),
    },
};
