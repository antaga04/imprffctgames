import { lizardtypeHandlers } from './lizardtype';
import { pokemonHandlers } from './pokemon';
import { puzzle15Handlers } from './puzzle15';
import { tictactoeHandlers } from './tictactoe';

export const handlerRegistry: Record<string, any> = {
    pokemon: pokemonHandlers,
    puzzle15: puzzle15Handlers,
    lizardtype: lizardtypeHandlers,
    tictactoe: tictactoeHandlers,
};
