import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { games } from '@/lib/games';
import GameNotFound from '@/pages/GameNotFound';

const Game = () => {
    const { id } = useParams();
    const [GameComponent, setGameComponent] = useState<React.ComponentType | null>(null);
    const [loading, setLoading] = useState(true);
    const [valid, setValid] = useState(true);

    useEffect(() => {
        const gameEntry = games[id as keyof typeof games];

        if (gameEntry?.loader) {
            setValid(true);
            setLoading(true);
            gameEntry.loader().then((Comp) => {
                setGameComponent(() => Comp);
                setLoading(false);
            });
        } else {
            setValid(false);
            setGameComponent(null);
            setLoading(false);
        }
    }, [id]);

    if (loading)
        return <div className="flex flex-col items-center justify-center min-h-screen p-6">Loading game...</div>;
    if (!valid || !GameComponent) return <GameNotFound />;

    return <GameComponent />;
};

export default Game;
