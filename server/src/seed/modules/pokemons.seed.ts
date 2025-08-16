import fs from 'fs';
import path from 'path';
import Pokemon from '@/models/pokemon';
import { fetchPokemonDetails } from '../lib/pokeapi';
import { uploadPokemonImage, cloudinaryIsConfigured } from '../lib/cloudinary';
import { shuffleArray } from '../lib/utils';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RAW_DATA_PATH = path.join(__dirname, '../data/pokemons.raw.json');
const BACKUP_DATA_PATH = path.join(__dirname, '../data/pokemons.backup.json');

export async function seedPokemons() {
    try {
        console.log('$ Seeding Pokémon...');

        // Clear existing
        await Pokemon.deleteMany({});
        console.log('  - Cleared existing Pokémon');

        // Check if backup exists
        if (fs.existsSync(BACKUP_DATA_PATH)) {
            console.log('  - Using backup Cloudinary data');
            const backupData = JSON.parse(fs.readFileSync(BACKUP_DATA_PATH, 'utf-8'));
            for (const poke of backupData) {
                await Pokemon.create(poke);
                console.log(`  - Restored Pokémon: ${poke.name}`);
            }
            console.log('$ Pokémon seeding completed from backup!');
            return;
        }

        // Load or fetch raw data
        let rawData: Record<number, PokemonDetails>;
        if (fs.existsSync(RAW_DATA_PATH)) {
            console.log('  - Using cached Pokémon data');
            rawData = JSON.parse(fs.readFileSync(RAW_DATA_PATH, 'utf-8'));
        } else {
            console.log('  - Fetching Pokémon data from PokéAPI...');
            rawData = {};
            for (let id = 1; id <= 151; id++) {
                const details = await fetchPokemonDetails(id);
                rawData[id] = {
                    pokeId: details.pokeId,
                    name: details.name,
                    sprites: {
                        default: details.sprites.default,
                        artwork: details.sprites.artwork,
                    },
                };
            }
            fs.writeFileSync(RAW_DATA_PATH, JSON.stringify(rawData, null, 2));
            console.log(`  - Saved raw Pokémon data to ${RAW_DATA_PATH}`);
        }

        const shouldUploadImages = process.env.SEED_UPLOAD_IMAGES === 'true';

        if (cloudinaryIsConfigured() && shouldUploadImages) {
            console.log('  - Uploading Pokémon images to Cloudinary');

            const shuffled = shuffleArray(Object.values(rawData));
            const backupData: any[] = [];

            // First loop: upload color and insert docs
            for (const poke of shuffled) {
                const colorUrl = await uploadPokemonImage(poke.sprites.default, false);
                const seedData: PokemonSeedData = {
                    pokeId: poke.pokeId,
                    name: poke.name,
                    sprite: { color: colorUrl, gray: '' },
                };
                await Pokemon.create(seedData);
                backupData.push({
                    pokeId: poke.pokeId,
                    name: poke.name,
                    sprite: { color: colorUrl, gray: '' },
                });
                console.log(`  - Created Pokémon: ${poke.name}`);
            }

            // Second loop: upload gray and update docs
            const shuffledAgain = shuffleArray(Object.values(rawData));
            for (const poke of shuffledAgain) {
                const grayUrl = await uploadPokemonImage(poke.sprites.default, true);
                await Pokemon.updateOne({ pokeId: poke.pokeId }, { $set: { 'sprite.gray': grayUrl } });
                const backupEntry = backupData.find((p) => p.pokeId === poke.pokeId);
                if (backupEntry) backupEntry.sprite.gray = grayUrl;
                console.log(`  - Updated gray sprite for: ${poke.name}`);
            }

            fs.writeFileSync(BACKUP_DATA_PATH, JSON.stringify(backupData, null, 2));
            console.log(`  - Saved backup Pokémon data to ${BACKUP_DATA_PATH}`);
        } else {
            console.log('  - Skipping Cloudinary uploads, using default PokeAPI URLs');
            for (const poke of Object.values(rawData)) {
                const seedData: PokemonSeedData = {
                    pokeId: poke.pokeId,
                    name: poke.name,
                    sprite: { color: poke.sprites.default, gray: poke.sprites.default },
                };
                await Pokemon.create(seedData);
                console.log(`  - Created Pokémon: ${poke.name}`);
            }
        }

        console.log('$ Pokémon seeding completed!\n');
    } catch (err) {
        console.error('Error seeding Pokémon:', err);
        throw err;
    }
}
