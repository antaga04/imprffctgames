import { useParams } from 'react-router-dom';
import GameNotFound from '@/pages/GameNotFound';
import TicTacToe from '@/games/TicTacToe';
import Puzzle15 from '@/games/Puzzle15';
import Wordle from '@/games/Wordle';
import Pokemon from '@/games/Pokemon';
import Hangman from '@/games/Hangman';

const Game = () => {
    const { id } = useParams();

    let gameComponent;

    switch (id) {
        case 'tictactoe':
            gameComponent = <TicTacToe />;
            break;
        case '15puzzle':
            gameComponent = <Puzzle15 />;
            break;
        case 'wordle':
            gameComponent = <Wordle />;
            break;
        case 'pokemon':
            gameComponent = <Pokemon />;
            break;
        case 'hangman':
            gameComponent = <Hangman />;
            break;
        default:
            gameComponent = <GameNotFound />;
            break;
    }

    return <div className="game-container">{gameComponent}</div>;
};

export default Game;
