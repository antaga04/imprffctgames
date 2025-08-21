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
