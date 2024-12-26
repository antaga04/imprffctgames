import { useState } from 'react';
import Confetti from 'react-confetti';
import BackButton from '@/components/ui/BackButton';

const Hangman = () => {
    const [showConfetti, setShowConfetti] = useState(false);

    const handleConfetti = () => {
        if (showConfetti) {
            setShowConfetti(false);
        } else {
            setShowConfetti(true);
        }
    };

    return (
        <>
            {showConfetti && <Confetti />}

            <BackButton />

            <div className="min-h-screen flex flex-col justify-center items-center">
                <h1 className="text-4xl font-bold text-center neon-text text-white mb-4">Hangman</h1>
                <button
                    onClick={handleConfetti}
                    className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 z-10"
                >
                    confetti
                </button>
            </div>
        </>
    );
};

export default Hangman;
