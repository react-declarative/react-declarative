const awaiter = async <V extends any>(value: Promise<V>) => {
    try {
        return await value;
    } catch {
        return Promise.resolve(null);
    }
};

export const trycatch = <T extends (...args: A) => any, A extends any[], V extends any>(run: T): (...args: A) => ReturnType<T> => {
    return (...args) => {
        try {
            const result = run(...args);
            if (result instanceof Promise) {
                return awaiter<V>(result);
            }
            return result;
        } catch {
            return null;
        }
    };
}

export default trycatch;
