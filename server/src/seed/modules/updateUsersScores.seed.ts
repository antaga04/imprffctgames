import User from '@/models/user';
import Score from '@/models/score';

export async function updateUsersWithScores() {
    try {
        console.log('$ Updating users with their scores...');

        const users = await User.find({});

        for (const user of users) {
            const scores = await Score.find({ user_id: user._id }, '_id');
            const scoreIds = scores.map((s) => s._id);

            await User.findByIdAndUpdate(user._id, { scores: scoreIds });

            console.log(`  - Updated user ${user.nickname} with ${scoreIds.length} scores`);
        }

        console.log('$ Users updated with scores successfully!\n');
    } catch (err) {
        console.error('Error updating users with scores:', err);
        throw err;
    }
}
