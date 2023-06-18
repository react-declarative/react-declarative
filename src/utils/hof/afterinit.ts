export interface IWrappedFn<T extends any = any, P extends any[] = any> {
    (...args: P): Promise<T>;
    clear(): void;
};

export const afterinit = <T extends any = any, P extends any[] = any[]>(run: (...args: P) => Promise<T>): IWrappedFn<T, P> => {

    let hasComplete = false;

    const wrappedFn = (...args: P) => {
        if (!hasComplete) {
            hasComplete = true;
            return Promise.resolve() as never;
        }
        return run(...args);
    };

    wrappedFn.clear = () => {
        hasComplete = false;
    };

    return wrappedFn;
};

export default afterinit;
