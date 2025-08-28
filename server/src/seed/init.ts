import { connectToDatabase } from '@/config/db';
// Seed modules
import { seedGames } from './modules/games.seed';
import { seedPokemons } from './modules/pokemons.seed';
import { seedUsers } from './modules/users.seed';
import { seedScores } from './modules/scores.seed';
import { updateUsersWithScores } from './modules/updateUsersScores.seed';

async function initDB() {
    console.log('##### INIT DB... #####');

    await connectToDatabase();
    await seedGames();
    await seedPokemons();
    await seedUsers();
    await seedScores();
    await updateUsersWithScores();
    console.log('✅ Default DB seeded');
    process.exit(0);
}

initDB().catch((err) => {
    console.error('❌ Error seeding DB', err);
    process.exit(1);
});
