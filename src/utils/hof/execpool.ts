/**
 * Represents a wrapped function that returns a promise.
 * @template T - The type of the result of the wrapped function.
 * @template P - The types of the parameters of the wrapped function.
 */
export interface IWrappedFn<T extends any = any, P extends any[] = any> {
    (...args: P): Promise<T>;
    clear(): void;
};

interface IConfig {
    maxExec: number;
}

export const execpool = <T extends any = any, P extends any[] = any[]>(run: (...args: P) => Promise<T>, {
    maxExec = 3,
}: Partial<IConfig> = {}): IWrappedFn<T, P> => {

    const execStack = new Set<Promise<T>>();

    const wrappedFn: IWrappedFn<T, P> = async (...args: P) => {
        if (execStack.size < maxExec) {
            const exec = run(...args);
            execStack.add(exec);
            exec.finally(() => {
                execStack.delete(exec);
            });
            return exec;
        }
        await Promise.race(execStack);
        return await wrappedFn(...args);
    };

    wrappedFn.clear = () => {
        execStack.clear();
    };

    return wrappedFn;
};

export default execpool;
