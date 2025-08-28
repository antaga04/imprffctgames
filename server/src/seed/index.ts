import inquirer from 'inquirer';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectToDatabase as connectDB } from '@/config/db';

// Seed modules
import { seedGames } from './modules/games.seed';
import { seedPokemons } from './modules/pokemons.seed';
import { seedUsers } from './modules/users.seed';
import { seedScores } from './modules/scores.seed';
import { updateUsersWithScores } from './modules/updateUsersScores.seed';

dotenv.config();

// -------------------------
// Step 1: Select collection
// -------------------------
async function selectCollection() {
    const { collection } = await inquirer.prompt({
        type: 'list',
        name: 'collection',
        message: 'Select collection to seed:',
        choices: [
            { name: '1) Pokémon (safe, independent)', value: 'pokemons' },
            { name: '2) Games', value: 'games' },
            { name: '3) Users', value: 'users' },
            { name: '4) Scores', value: 'scores' },
            { name: '5) All', value: 'all' },
            { name: '6) Exit', value: 'exit' },
        ],
    });
    return collection;
}

// -------------------------
// Step 2: Confirm dependent actions
// -------------------------
async function confirmDependencies(collection: string) {
    let confirm = true;
    let includePokemon = false;

    if (collection === 'all') {
        const result = await inquirer.prompt({
            type: 'confirm',
            name: 'includePokemon',
            message: 'Do you want to include Pokémon in this full seed?',
            default: true,
        });
        includePokemon = result.includePokemon;
        console.log(`$ Seeding Everything ${includePokemon ? '(including Pokémon)' : '(excluding Pokémon)'}...`);
    } else if (collection === 'games') {
        const result = await inquirer.prompt({
            type: 'confirm',
            name: 'confirm',
            message: '⚠️ Seeding Games will also update Scores & Users (scores). Continue?',
        });
        confirm = result.confirm;
    } else if (collection === 'users') {
        const result = await inquirer.prompt({
            type: 'confirm',
            name: 'confirm',
            message: '⚠️ Seeding Users will also update Scores & Users. Continue?',
        });
        confirm = result.confirm;
    } else if (collection === 'scores') {
        const result = await inquirer.prompt({
            type: 'confirm',
            name: 'confirm',
            message: '⚠️ Seeding Scores will also update Users. Continue?',
        });
        confirm = result.confirm;
    } else if (collection === 'pokemons') {
        console.log(`🟢 Seeding Pokémon:
- If pokemons.backup.json exists → uses existing Cloudinary URLs, no uploads.
- Else if Cloudinary is configured and uploads are enabled → uploads color and gray sprites in two loops, saves backup.
- Else → uses raw PokeAPI sprite URLs, no uploads.
- MongoDB Pokémon documents are created or updated using the chosen sprite URLs.
`);
        confirm = true;
    }

    return { confirm, includePokemon };
}

// -------------------------
// Run seed actions
// -------------------------
async function runSeedAction(collection: string, includePokemon = false) {
    switch (collection) {
        case 'pokemons':
            console.log('$ Seeding Pokémon...\n');
            await seedPokemons();
            break;

        case 'games':
            console.log('$ Seeding Games + dependent collections...\n');
            await seedGames();
            await seedScores();
            await updateUsersWithScores();
            break;

        case 'users':
            console.log('$ Seeding Users + dependent collections...\n');
            await seedUsers();
            await seedScores();
            await updateUsersWithScores();
            break;

        case 'scores':
            console.log('$ Seeding Scores + updating Users...\n');
            await seedScores();
            await updateUsersWithScores();
            break;

        case 'all':
            console.log('$ Seeding Everything in proper order...\n');
            await seedGames();
            if (includePokemon) await seedPokemons();
            await seedUsers();
            await seedScores();
            await updateUsersWithScores();
            break;

        case 'exit':
            console.log('\n$ Exiting seed script.\n');
            return 'exit';

        default:
            console.warn('⚠️ Unknown collection:', collection);
    }
}

// -------------------------
// Main loop
// -------------------------
async function main() {
    await connectDB();

    let exit = false;

    while (!exit) {
        const collection = await selectCollection();
        if (collection === 'exit') break;

        const confirmed = await confirmDependencies(collection);
        if (!confirmed) continue;

        const result = await runSeedAction(collection);
        if (result === 'exit') exit = true;
    }

    await mongoose.disconnect();
    console.log('\n$ MongoDB connection closed.\n');
}

// -------------------------
// Execute
// -------------------------
main().catch((err) => {
    console.error('❌ Error running seed script:', err);
    process.exit(1);
});
