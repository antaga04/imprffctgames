const specialKeys = ['Backspace', 'Alt', 'Meta', 'Shift', 'Control', 'Tab', 'Enter', 'CapsLock', 'Escape'];

export const generateWords = (wordList: string[]) => {
    const generatedWords = [];
    for (let i = 0; i < 200; i++) {
        generatedWords.push(wordList[Math.floor(Math.random() * wordList.length)]);
    }
    return generatedWords;
};

export function calculateTypingMetrics(keystrokes: KeystrokeData[], words: string[], seconds: number): TypingMetrics {
    const grouped = splitKeystrokesBySpace(keystrokes);
    const {
        allCorrect: correct,
        allIncorrect: incorrect,
        allHits: hits,
        allMistakes: mistakes,
        allMissed: missed,
    } = calculateResults(grouped, words);

    const totalKeystrokes = keystrokes.length;
    const accuracy = trunk2(((hits - mistakes) / hits) * 100) || 0;
    const consistency = trunk2(calculateConsistency(keystrokes));

    return {
        wpm: trunk2(correct / 5 / (seconds / 60)),
        raw: trunk2(totalKeystrokes / 5 / (seconds / 60)),
        accuracy,
        consistency,
        correct,
        incorrect,
        hits,
        mistakes,
        missed,
    };
}

function trunk2(num: number) {
    return Math.trunc(num * 100) / 100;
}

function splitKeystrokesBySpace(logs: KeystrokeData[]) {
    let result = [];
    let currentWord = [];

    for (let i = 0; i < logs.length; i++) {
        if (logs[i].key === ' ') {
            if (currentWord.length > 0) {
                result.push(currentWord);
                currentWord = [];
            }
        } else {
            currentWord.push(logs[i]);
        }
    }

    if (currentWord.length > 0) {
        result.push(currentWord); // push last word if no trailing space
    }

    return result;
}

function calculateResults(grouped: KeystrokeData[][], words: string[]) {
    let w = 0;
    let allCorrect = 0;
    let allIncorrect = 0;
    let allHits = 0;
    let allMistakes = 0;
    let allMissed = 0;

    while (w < grouped.length) {
        const wordLetters = words[w].split('');
        let correct = 0;
        let incorrect = 0;
        let hits = 0;
        let mistakes = 0;
        let extra = 0;
        let missed = 0;
        let lastCorrect = true;

        let index = 0;

        for (let k = 0; k < grouped[w].length; k++, index++) {
            if (wordLetters[index] === grouped[w][k].key) {
                correct++;
                hits++;
                lastCorrect = true;
            } else if (specialKeys.includes(grouped[w][k].key)) {
                if (grouped[w][k + 1] && grouped[w][k + 1].key === 'Backspace') {
                    index = -1;
                    correct = 0;
                    incorrect = 0;
                }
            } else if (grouped[w][k].key === 'Backspace') {
                if (lastCorrect) {
                    correct--;
                } else {
                    incorrect--;
                }
                index--;
                index !== -1 && index--;
            } else {
                mistakes++;
                incorrect++;
                lastCorrect = false;
            }

            if (wordLetters.length > grouped[w].length) {
                missed += wordLetters.length - grouped[w].length;
            }
        }

        allCorrect += correct;
        allIncorrect += incorrect;
        allHits += hits;
        allMistakes += mistakes;
        allMissed += missed;
        w++;
    }

    return { allCorrect, allIncorrect, allHits, allMistakes, allMissed };
}

function calculateConsistency(keystrokes: KeystrokeData[]): number {
    // Extract spacings
    const spacings = keystrokes.map((k) => k.spacing).filter((s): s is number => s !== undefined);

    if (spacings.length < 2) return 100; // Not enough data, assume perfect consistency

    // Mean
    const mean = spacings.reduce((a, b) => a + b, 0) / spacings.length;

    // Variance + standard deviation
    const variance = spacings.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / spacings.length;
    const sd = Math.sqrt(variance);

    // Consistency metric (0–100%)
    const consistency = Math.max(0, 1 - sd / mean) * 100;

    return consistency;
}
