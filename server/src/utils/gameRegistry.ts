import Game from '@/api/models/game';
import { handlerRegistry } from '@/handlers';

let GAME_SCORING: Record<string, any> | null = null;

export async function getGameScoring() {
    if (!GAME_SCORING) {
        const games = await Game.find().lean();

        GAME_SCORING = {};
        for (const g of games) {
            if (handlerRegistry[g.slug]) {
                GAME_SCORING[g._id.toString()] = handlerRegistry[g.slug];
            }
        }
    }
    return GAME_SCORING;
}
