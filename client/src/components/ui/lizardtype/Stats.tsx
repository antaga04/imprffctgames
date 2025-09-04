import { getColorClass } from '@/lib/gameUtils';
import { useTranslation } from 'react-i18next';

const Stats: React.FC<{ gameState: LizardtypeGameState; stats: LizardtypeStats | null }> = ({ gameState, stats }) => {
    const { t } = useTranslation();

    const performanceRating = (stats: LizardtypeStats) => {
        // Normalize each component to 0–100%
        const wpmScore = Math.min(100, (stats.wpm / 15) * 10); // Example scaling factor, adjust as needed
        const accuracyScore = Math.min(100, stats.accuracy); // already in %
        const consistencyScore = Math.min(100, stats.consistency); // already in %
        const mistakePenalty = Math.max(0, 100 - (stats.mistakes / Math.max(1, stats.hits)) * 100);

        // Weighted average (equal weight = 25% each)
        const performanceScore =
            wpmScore * 0.25 + accuracyScore * 0.25 + consistencyScore * 0.25 + mistakePenalty * 0.25;

        // Clamp 0–100
        const normalizedScore = Math.min(100, Math.max(0, performanceScore));

        // Map to rating labels
        const getLabel = (score: number) => {
            if (score >= 95) return 'King';
            if (score >= 85) return 'Exceptional';
            if (score >= 70) return 'Excellent';
            if (score >= 60) return 'Good';
            if (score >= 40) return 'Fair';
            if (score >= 20) return 'Poor';
            return 'Needs Practice';
        };

        return (
            <div className={`text-lg font-bold ${getColorClass(normalizedScore, 'performance')}`}>
                {getLabel(normalizedScore)} ({normalizedScore.toFixed(0)}%)
            </div>
        );
    };

    return (
        <>
            {gameState === 'finished' && stats && (
                <div className="p-4 sm:p-6 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 border border-gray-700 rounded-xl shadow-2xl">
                    <div className="text-center space-y-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-white font-mono mb-8">
                            {t('games.lizardtype.completed')}
                        </h2>

                        {/* Primary Stats - Most Important */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-600/30 hover:border-gray-500/50 transition-all duration-200">
                                <div
                                    className={`text-3xl sm:text-4xl font-bold font-mono ${getColorClass(stats.wpm, 'wpm')} mb-1`}
                                >
                                    {stats.wpm.toFixed(2)}
                                </div>
                                <div className="text-xs sm:text-sm text-gray-400 uppercase tracking-wide">
                                    {t('globals.wpm')}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">{t('games.lizardtype.stats.wpm')}</div>
                            </div>

                            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-600/30 hover:border-gray-500/50 transition-all duration-200">
                                <div
                                    className={`text-3xl sm:text-4xl font-bold font-mono ${getColorClass(stats.accuracy, 'accuracy')} mb-1`}
                                >
                                    {stats.accuracy.toFixed(2)}%
                                </div>
                                <div className="text-xs sm:text-sm text-gray-400 uppercase tracking-wide">
                                    {t('globals.accuracy')}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">{t('games.lizardtype.stats.correct')}</div>
                            </div>

                            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-600/30 hover:border-gray-500/50 transition-all duration-200 sm:col-span-1 col-span-1">
                                <div
                                    className={`text-3xl sm:text-4xl font-bold font-mono ${getColorClass(stats.consistency, 'consistency')} mb-1`}
                                >
                                    {stats.consistency.toFixed(2)}%
                                </div>
                                <div className="text-xs sm:text-sm text-gray-400 uppercase tracking-wide">
                                    {t('globals.consistency')}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">{t('games.lizardtype.stats.timing')}</div>
                            </div>
                        </div>

                        {/* Secondary Stats - Additional Info */}
                        <div className="pt-4 border-t border-gray-700/50">
                            <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wide">
                                {t('games.lizardtype.stats.details')}
                            </h3>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                                <div className="bg-gray-800/30 rounded-lg p-3 text-center">
                                    <div className="text-lg sm:text-xl font-bold font-mono text-blue-400">
                                        {stats.raw.toFixed(1)}
                                    </div>
                                    <div className="text-xs text-gray-400">{t('games.lizardtype.stats.raw')}</div>
                                </div>

                                <div className="bg-gray-800/30 rounded-lg p-3 text-center">
                                    <div className="text-lg sm:text-xl font-bold font-mono text-green-400">
                                        {stats.correct}
                                    </div>
                                    <div className="text-xs text-gray-400">{t('gloabls.correct')}</div>
                                </div>

                                <div className="bg-gray-800/30 rounded-lg p-3 text-center">
                                    <div className="text-lg sm:text-xl font-bold font-mono text-red-400">
                                        {stats.incorrect}
                                    </div>
                                    <div className="text-xs text-gray-400">{t('globals.incorrect')}</div>
                                </div>

                                <div className="bg-gray-800/30 rounded-lg p-3 text-center">
                                    <div className="text-lg sm:text-xl font-bold font-mono text-yellow-400">
                                        {stats.hits}
                                    </div>
                                    <div className="text-xs text-gray-400">{t('games.lizardtype.stats.hits')}</div>
                                </div>
                            </div>

                            {/* Error Analysis - Tertiary Stats */}
                            <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-3">
                                <div className="bg-gray-800/30 rounded-lg p-3 text-center">
                                    <div className="text-lg sm:text-xl font-bold font-mono text-orange-400">
                                        {stats.mistakes}
                                    </div>
                                    <div className="text-xs text-gray-400">{t('games.lizardtype.stats.mistakes')}</div>
                                </div>

                                <div className="bg-gray-800/30 rounded-lg p-3 text-center">
                                    <div className="text-lg sm:text-xl font-bold font-mono text-purple-400">
                                        {stats.missed}
                                    </div>
                                    <div className="text-xs text-gray-400">{t('games.lizardtype.stats.missed')}</div>
                                </div>
                            </div>
                        </div>

                        {/* Performance Summary */}
                        <div className="pt-4 border-t border-gray-700/50">
                            <div className="bg-gray-800/30 rounded-lg p-4">
                                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                    <div className="text-center sm:text-left">
                                        <div className="text-sm text-gray-400">
                                            {t('games.lizardtype.stats.performance')}
                                        </div>
                                        {performanceRating(stats)}
                                    </div>

                                    <div className="text-center sm:text-right">
                                        <div className="text-sm text-gray-400">
                                            {t('games.lizardtype.stats.errorRate')}
                                        </div>
                                        <div
                                            className={`text-lg font-bold ${getColorClass((stats.mistakes / stats.hits) * 100, 'errorRate')}`}
                                        >
                                            {((stats.mistakes / stats.hits) * 100).toFixed(1)}%
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Stats;
