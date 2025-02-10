export const getRandomSequence = (min, max, count) => {
    const sequence = [];
    while (sequence.length < count) {
        const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
        if (!sequence.includes(randomNum)) {
            sequence.push(randomNum);
        }
    }
    return sequence;
};
