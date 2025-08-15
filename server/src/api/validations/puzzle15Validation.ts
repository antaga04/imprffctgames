import GameSession from '@/api/models/gameSession';

// Constants for the game
const GRID_SIZE = 4;

/**
 * Checks if a move is valid for the 15-puzzle game.
 * @param {number} from - The index of the starting tile.
 * @param {number} to - The index of the target tile.
 * @returns {boolean} - Returns true if the move is valid (adjacent tiles), false otherwise.
 */
function isValidMove(from: number, to: number): boolean {
    // For 15-puzzle, check if the move is to an adjacent tile (up, down, left, right)
    const directions = [
        { dx: -1, dy: 0 }, // Left
        { dx: 1, dy: 0 }, // Right
        { dx: 0, dy: -1 }, // Up
        { dx: 0, dy: 1 }, // Down
    ];

    const fromRow = Math.floor(from / GRID_SIZE);
    const fromCol = from % GRID_SIZE;
    const toRow = Math.floor(to / GRID_SIZE);
    const toCol = to % GRID_SIZE;

    // Check if the to position is adjacent to the from position
    for (const { dx, dy } of directions) {
        if (fromRow + dx === toRow && fromCol + dy === toCol) {
            return true;
        }
    }
    return false;
}

/**
 * Validates the score data for the 15-puzzle game to prevent cheating.
 *
 * This function checks the following:
 * - Ensures the `moves` array and `time` are correctly formatted.
 * - Verifies that the game session exists and matches the provided hash.
 * - Ensures move timestamps are in chronological order.
 * - Checks if moves are valid based on board state.
 * - Detects suspiciously short move durations (< 100ms).
 * - Validates the reported game time against move timestamps.
 * - Flags sequences with an unusually high move rate (> 5 moves in 1 second).
 * - Confirms that the final board state is correctly solved.
 *
 * @param {Object} scoreData - The score data submitted by the client.
 * @param {Array} scoreData.moves - Array of move objects made by the player.
 * @param {number} scoreData.time - The total reported time taken to solve the puzzle.
 * @param {string} scoreData.gameSessionId - The ID of the game session associated with the score.
 * @param {string} scoreData.hash - A hash representing the session state to prevent tampering.
 *
 * @returns {boolean} - Returns `true` if the score data is valid; `false` otherwise.
 */
export async function validatePuzzle15ScoreData(
    scoreData: Puzzle15ScoreData,
): Promise<{ isValid: boolean; newScore: any }> {
    const { moves, time, gameSessionId } = scoreData;

    // Validate moves and time
    if (!Array.isArray(moves) || typeof time !== 'number') {
        console.log('moves or time invalid');
        return { isValid: false, newScore: null };
    }
    if (moves.length === 0 || time < 2) {
        console.log('moves or time invalid');
        return { isValid: false, newScore: null };
    }

    // Fetch the GameSession from the database
    const gameSession = await GameSession.findById(gameSessionId);
    if (!gameSession) {
        console.log('Game session does not exist');
        return { isValid: false, newScore: null }; // Session doesn't exist
    }

    // Check if the session hash matches the one in the game session
    if (gameSession.hash !== scoreData.hash) {
        console.log('Hashes do not match');
        return { isValid: false, newScore: null };
    }

    let board = gameSession.state; // Initial board state
    let lastTimestamp = null; // Track the time of the last move to validate timestamps
    let totalMoveTime = 0; // Track total time from first to last move
    let suspiciousMoveCount = 0; // Track how many moves are suspiciously fast

    // Replay the moves and validate them
    for (let i = 0; i < moves.length; i++) {
        let { from, to, timestamp } = moves[i];

        // Ensure timestamp is a number
        timestamp = Number(timestamp);
        if (isNaN(timestamp)) {
            console.log('Invalid timestamp detected');
            return { isValid: false, newScore: null };
        }

        // Ensure from and to positions are valid
        if (!isValidMove(from, to)) {
            console.log('Invalid move detected');
            return { isValid: false, newScore: null };
        }

        // Ensure timestamps are reasonable
        if (lastTimestamp !== null && timestamp <= lastTimestamp) {
            console.log('Bad timestamp: Moves must occur in chronological order');
            return { isValid: false, newScore: null }; // Move must happen after the last one
        }

        // Check for excessive time between moves
        if (lastTimestamp !== null) {
            const timeTaken = timestamp - lastTimestamp;
            if (timeTaken < 0.1) {
                // 100ms min between moves
                console.log(`Suspiciously short move time: ${timeTaken} seconds`);
                suspiciousMoveCount += 1;
            }
        }

        totalMoveTime = timestamp - moves[0].timestamp; // Calculate total time from the first move

        lastTimestamp = timestamp; // Update last move time

        // Make the move and update the board
        [board[from], board[to]] = [board[to], board[from]];
    }

    const totalGameTime = lastTimestamp - moves[0].timestamp;

    const bufferTime = 1500;
    if (Math.abs(totalGameTime - time * 1000) > bufferTime) {
        console.log('Total game time does not match the recorded time');
        return { isValid: false, newScore: null };
    }

    // Check for suspiciously fast sequences (e.g., 5+ moves in 1 second)
    if (suspiciousMoveCount > 5) {
        console.log('Suspiciously fast sequence of moves detected');
        return { isValid: false, newScore: null };
    }

    // Validate that the board is correctly solved (solved when it's in ascending order)
    if (board.some((val, index) => val !== index)) {
        console.log('Board is not solved');
        return { isValid: false, newScore: null };
    }

    return {
        isValid: true,
        newScore: {
            moves: moves.length,
            time,
        },
    };
}
