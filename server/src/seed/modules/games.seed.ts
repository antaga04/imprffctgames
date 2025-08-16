import Game from '@/models/game';
import games from '../data/games.json';

export async function seedGames() {
    try {
        console.log('$ Seeding games...');

        // Clear existing games
        await Game.deleteMany({});
        console.log('  - Cleared existing games');

        // Create games
        for (const game of games) {
            await Game.create(game);
            console.log(`  - Created game: ${game.name}`);
        }

        console.log('$ Games seeding completed!\n');
    } catch (err) {
        console.error('Error seeding games:', err);
        throw err;
    }
}
