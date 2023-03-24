export interface IWrappedFn<T extends any = any, P extends any[] = any> {
    (...args: P): Promise<T>;
    clear(): void;
};

export const queued = <T extends any = any, P extends any[] = any[]>(promise: (...args: P) => Promise<T>): IWrappedFn<T, P> => {

    let lastPromise: Promise<any> = Promise.resolve();

    const wrappedFn = (...args: P) => {
        lastPromise = lastPromise
            .then(() => promise(...args))
            .finally(() => wrappedFn.clear());
        return lastPromise;
    };

    wrappedFn.clear = () => {
        lastPromise = Promise.resolve();
    };

    return wrappedFn;
};

export default queued;
