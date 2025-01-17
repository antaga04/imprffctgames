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
