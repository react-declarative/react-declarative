type Result<A extends any[], V = any> = (...args: A) => V | null;

const awaiter = async <V extends any>(value: Promise<V>) => {
    try {
        return await value;
    } catch {
        return Promise.resolve(null);
    }
};

export const trycatch = <T extends (...args: A) => V, A extends any[], V extends any>(run: T): Result<A, V> => (...args) => {
    try {
        const result = run(...args);
        if (result instanceof Promise) {
            return awaiter<V>(result) as unknown as V;
        }
        return result;
    } catch {
        return null;
    }
}

export default trycatch;
