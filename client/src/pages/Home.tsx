import Header from '@/components/Header';
import { games } from '@/lib/games';
import GameItem from '@/components/ui/GameItem';
import Footer from '@/components/Footer';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

const Home = () => {
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const hasShownToast = sessionStorage.getItem('hasShownRegisterToast');
        if (!hasShownToast && !isAuthenticated) {
            toast.info('You can login to appear in the rankings!');
            sessionStorage.setItem('hasShownRegisterToast', 'true');
        }
    }, []);

    return (
        <>
            <Header />
            <main className="flex md:items-center md:justify-center">
                <ul className="md:m-auto md:py-12 md:px-[7%] grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] m-0 max-w-none w-full gap-4 items-center justify-center rounded-lg">
                    {Object.entries(games).map(([key, { name, url, thumbnail }]) => (
                        <GameItem key={key} link={url} name={name} thumbnail={thumbnail} />
                    ))}
                </ul>
            </main>
            <Footer />
        </>
    );
};

export default Home;
