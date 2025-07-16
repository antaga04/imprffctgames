export function getRandomSequence(min: number, max: number, count: number): number[] {
    if (count > max - min + 1) {
        throw new Error('Count is too large for the given range.');
    }

    const sequence = new Set<number>();

    while (sequence.size < count) {
        const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
        sequence.add(randomNum);
    }

    return Array.from(sequence);
}
