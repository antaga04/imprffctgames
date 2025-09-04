import ToggleButton from './ToggleButton';
import { LANGUAGES, LIZARDTYPE_VARIANTS } from '@/lib/constants';

interface ControlsProps {
    gameMode: LizardtypeGameMode;
    setGameMode: (mode: LizardtypeGameMode) => void;
    gameState: LizardtypeGameState;
    resetGame: () => void;
    language: Language;
    setLanguage: (lang: Language) => void;
    resetFocus: () => void;
}

export default function Controls({
    gameMode,
    setGameMode,
    gameState,
    resetGame,
    language,
    setLanguage,
    resetFocus,
}: ControlsProps) {
    return (
        <div className="flex gap-4 items-center flex-col md:flex-row">
            {/* Game Modes */}
            <div className="flex gap-2">
                {LIZARDTYPE_VARIANTS.map((mode) => (
                    <ToggleButton<LizardtypeGameMode>
                        key={mode}
                        label={mode}
                        value={mode}
                        selectedValue={gameMode}
                        onClick={() => {
                            setGameMode(mode);
                            resetGame();
                        }}
                        disabled={gameState === 'playing'}
                        size="sm"
                    />
                ))}
            </div>

            {/* Languages */}
            <div className="flex gap-2">
                {LANGUAGES.map((lang) => (
                    <ToggleButton<Language>
                        key={lang.value}
                        label={lang.label}
                        value={lang.value}
                        selectedValue={language}
                        onClick={() => {
                            setLanguage(lang.value);
                            resetFocus();
                            resetGame();
                        }}
                        disabled={gameState === 'playing'}
                        size="xs"
                    />
                ))}
            </div>
        </div>
    );
}
