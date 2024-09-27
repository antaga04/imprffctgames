import { useNavigate } from 'react-router-dom';

const GameNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="text-center mb-6">
        {/* Quirky character or icon */}
        <div className="text-6xl mb-4">🤷‍♂️</div> 
        
        <h1 className="text-4xl font-bold neon-text text-white mb-2">Oops! Game Not Found</h1>
        <p className="text-lg text-slate-300">
          It seems like the game you’re looking for doesn’t exist... yet!
        </p>
      </div>

      <button
        onClick={() => navigate('/')}
        className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700"
      >
        Back to Home
      </button>
    </div>
  );
};

export default GameNotFound;
