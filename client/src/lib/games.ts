export const games = {
    tictactoe: {
        name: 'Tic Tac Toe',
        url: 'tictactoe',
        thumbnail: '/tic-tac-toe.png',
        loader: () => import('@/games/TicTacToe').then((m) => m.default),
    },
    puzzle15: {
        name: '15 Puzzle',
        url: 'puzzle15',
        thumbnail: '/15.png',
        loader: () => import('@/games/Puzzle15').then((m) => m.default),
    },
    pokemon: {
        name: "Who's that Pokémon",
        url: 'pokemon',
        thumbnail: '/pokemon.png',
        loader: () => import('@/games/Pokemon').then((m) => m.default),
    },
    lizardtype: {
        name: 'Lizardtype',
        url: 'lizardtype',
        thumbnail: '/iguana.png',
        loader: () => import('@/games/LizardType').then((m) => m.default),
    },
};
