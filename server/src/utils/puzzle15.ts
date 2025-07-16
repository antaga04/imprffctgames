const GRID_SIZE = 4;
const CELL_COUNT = GRID_SIZE * GRID_SIZE;
const EMPTY_INDEX = CELL_COUNT - 1;

// Function to generate a solvable board
export function generateSolvableBoard(): Puzzle15Board {
    let board: Puzzle15Board;
    do {
        board = Array.from({ length: CELL_COUNT }, (_, i) => i);
        for (let i = board.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [board[i], board[j]] = [board[j], board[i]];
        }
    } while (!isSolvable(board));

    return board;
}

// Check if a board is solvable
function isSolvable(board: Puzzle15Board) {
    const inversionCount = board.reduce((count, tile, i) => {
        if (tile === EMPTY_INDEX) return count;
        for (let j = i + 1; j < board.length; j++) {
            if (board[j] !== EMPTY_INDEX && board[i] > board[j]) {
                count++;
            }
        }
        return count;
    }, 0);

    const emptyRowFromBottom = GRID_SIZE - Math.floor(board.indexOf(EMPTY_INDEX) / GRID_SIZE);

    if (GRID_SIZE % 2 === 1) {
        return inversionCount % 2 === 0;
    } else {
        return (
            (inversionCount % 2 === 0 && emptyRowFromBottom % 2 === 1) ||
            (inversionCount % 2 === 1 && emptyRowFromBottom % 2 === 0)
        );
    }
}
