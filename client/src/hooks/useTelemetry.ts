import { useRef, useState } from 'react';

const useKeystrokeRecorder = () => {
    const [keystrokes, setKeystrokes] = useState<KeystrokeData[]>([]);
    const lastKeyTime = useRef<number | null>(null);

    const recordKey = (key: string) => {
        const now = Date.now();
        setKeystrokes((prev) => {
            const spacing = lastKeyTime.current ? now - lastKeyTime.current : undefined;
            lastKeyTime.current = now;
            return [...prev, { key, timestamp: now, spacing }];
        });
    };

    const reset = () => {
        setKeystrokes([]);
        lastKeyTime.current = null;
    };

    return { keystrokes, recordKey, reset };
};

export default useKeystrokeRecorder;
