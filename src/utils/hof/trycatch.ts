const awaiter = async <V extends any>(value: Promise<V>, fallback?: (error: Error) => void) => {
    try {
        return await value;
    } catch (error) {
        fallback && fallback(error as Error);
        return null;
    }
};

export const trycatch = <T extends (...args: A) => any, A extends any[], V extends any>(run: T, fallback?: (error: Error) => void): (...args: A) => ReturnType<T> | null => {
    return (...args) => {
        try {
            const result = run(...args);
            if (result instanceof Promise) {
                return awaiter<V>(result, fallback);
            }
            return result;
        } catch (error) {
            fallback && fallback(error as Error);
            return null;
        }
    };
}

export default trycatch;
