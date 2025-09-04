import { UNIT_MAP } from './constants';

export const scoreFormatter = (score: Record<string, unknown>) => {
    return Object.keys(score)
        .filter((key) => typeof score[key] === 'number' || typeof score[key] === 'string')
        .map((key) => {
            const value = score[key];
            const unit = UNIT_MAP[key] ?? '';
            return `${capitalize(key)}: ${value}${unit}`;
        })
        .join(', ');
};

// Capitalize keys for display
const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

// Helper function to determine movement direction based on the pressed key
export const getTargetIndex = (key: string, emptyIndex: number, emptyRow: number, emptyCol: number, gridSize = 4) => {
    const GRID_SIZE = gridSize;
    let targetIndex: number | null = null;

    switch (key) {
        case 'ArrowUp':
        case 'w': // Move tile down (empty tile moves up)
            if (emptyRow < GRID_SIZE - 1) {
                targetIndex = emptyIndex + GRID_SIZE;
            }
            break;
        case 'ArrowDown':
        case 's': // Move tile up (empty tile moves down)
            if (emptyRow > 0) {
                targetIndex = emptyIndex - GRID_SIZE;
            }
            break;
        case 'ArrowLeft':
        case 'a': // Move tile right (empty tile moves left)
            if (emptyCol < GRID_SIZE - 1) {
                targetIndex = emptyIndex + 1;
            }
            break;
        case 'ArrowRight':
        case 'd': // Move tile left (empty tile moves right)
            if (emptyCol > 0) {
                targetIndex = emptyIndex - 1;
            }
            break;
        default:
            break;
    }

    return targetIndex;
};

export function getColorClass(value: number, type: string) {
    let thresholds = [20, 40, 60, 80, 100, 150];

    switch (type) {
        case 'wpm':
        case 'raw':
            thresholds = [20, 40, 60, 80, 100, 150];
            break;
        case 'accuracy':
        case 'consistency':
            thresholds = [15, 35, 50, 70, 85, 95];
            break;
        case 'performance':
            thresholds = [20, 40, 60, 70, 85, 95];
            break;
        case 'errorRate':
            thresholds = [90, 70, 50, 20, 10, 5];
            break;
        default:
            break;
    }

    if (value < thresholds[0]) return 'text-red-500';
    if (value < thresholds[1]) return 'text-orange-500';
    if (value < thresholds[2]) return 'text-yellow-500';
    if (value < thresholds[3]) return 'text-green-500';
    if (value < thresholds[4]) return 'text-blue-500';
    if (value < thresholds[5]) return 'text-purple-500';
    return 'text-blue-500';
}
