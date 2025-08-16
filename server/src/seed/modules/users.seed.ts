import User from '@/models/user';
import users from '../data/users.json';

export async function seedUsers() {
    try {
        console.log('$ Seeding users...');

        // Clear existing users
        await User.deleteMany({});
        console.log('  - Cleared existing users');

        for (const user of users) {
            await User.create(user);
            console.log(`  - Created user: ${user.nickname}`);
        }

        console.log('$ Users seeding completed!\n');
    } catch (err) {
        console.error('Error seeding users:', err);
        throw err;
    }
}
