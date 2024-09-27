import { useParams } from 'react-router-dom';
import TicTacToe from '../games/TicTacToe';
import GameNotFound from '../pages/GameNotFound';
import Puzzle15 from '../games/Puzzle15';

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
    default:
      gameComponent = <GameNotFound />;
      break;
  }

  return <div className="game-container">{gameComponent}</div>;
};

export default Game;
