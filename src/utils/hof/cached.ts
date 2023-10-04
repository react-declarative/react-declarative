interface IClearable {
    clear: () => void;
}

export const cached = <T extends (...args: A) => any, A extends any[]>(changed: (prevArgs: A, currentArgs: A) => boolean, run: T): T & IClearable => {

    let lastArgs: any = null;
    let initial = true;
    let lastValue: ReturnType<typeof run>;

    const clear = () => {
        lastArgs = null;
    };

    const executeFn = (...args: A) => {
        if (!initial) {
            if (!changed(lastArgs, args)) {
                return lastValue;
            }
        }
        lastArgs = args;
        initial = false;
        return lastValue = run(...args);
    };

    executeFn.clear = clear;

    return executeFn as T & IClearable;
};

export default cached;
