import Score from '@/models/score';
import User from '@/models/user';
import Game from '@/models/game';

function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function seedScores() {
    try {
        console.log('$ Seeding scores...');

        // Clear existing scores
        await Score.deleteMany({});
        console.log('  - Cleared existing scores');

        const users = await User.find({});
        const games = await Game.find({});

        for (const user of users) {
            for (const game of games) {
                let variant: number | undefined = undefined;
                if (game.variants && game.variants.length > 0) {
                    const randomIndex = getRandomInt(0, game.variants.length - 1);
                    variant = game.variants[randomIndex].key;
                }

                let scoreData: Record<string, any> = {};
                switch (game.scoringLogic) {
                    case 'guesses_correct_total':
                        scoreData = {
                            correct: getRandomInt(0, 20),
                            total: 20,
                            flaggedAsBot: false,
                        };
                        break;
                    case 'moves_time':
                        scoreData = {
                            moves: getRandomInt(10, 100),
                            time: getRandomInt(30, 300),
                        };
                        break;
                    case 'wpm_time':
                        scoreData = {
                            wpm: getRandomInt(20, 100),
                            time: variant,
                            consistency: getRandomInt(60, 100),
                        };
                        break;
                    default:
                        scoreData = {};
                }

                await Score.create({
                    user_id: user._id,
                    game_id: game._id,
                    variant,
                    scoreData,
                });

                console.log(
                    `  - Created score for user ${user.nickname} on game ${game.name}${variant ? ` (${variant})` : ''}`,
                );
            }
        }

        console.log('$ Scores seeding completed!\n');
    } catch (err) {
        console.error('Error seeding scores:', err);
        throw err;
    }
}
