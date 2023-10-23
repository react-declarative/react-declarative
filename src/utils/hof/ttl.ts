interface IClearable {
    clear: () => void;
}

const DEFAULT_TIMEOUT = 60 * 1000;

export const ttl = <T extends (...args: any[]) => any>(run: T, timeout = DEFAULT_TIMEOUT): T & IClearable => {

    let lastTtl = 0;
    let lastValue: ReturnType<T>;

    const clear = () => {
        lastTtl = 0;
    };

    const executeFn = (...args: any[]) => {
        const currentTtl = Date.now();
        if (currentTtl - lastTtl < timeout) {
            return lastValue;
        }
        lastTtl = currentTtl;
        return lastValue = run(...args);
    };

    executeFn.clear = clear;

    return executeFn as T & IClearable;
};

export default ttl;
