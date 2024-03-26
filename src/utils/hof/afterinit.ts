/**
 * Represents a function wrapped in a promise that can be executed and cleared.
 *
 * @template T - The type of the promise result.
 * @template P - The type of the function arguments.
 */
export interface IWrappedFn<T extends any = any, P extends any[] = any> {
    (...args: P): Promise<T>;
    clear(): void;
};

/**
 * Creates a wrapped function that only executes the provided function after the initial call has completed.
 * The wrapped function can be cleared to allow subsequent calls to execute the provided function again.
 *
 * @template T The type of the promise resolved by the provided function.
 * @template P The type of the arguments passed to the provided function.
 * @param run The function to be wrapped.
 * @returns The wrapped function.
 */
export const afterinit = <T extends any = any, P extends any[] = any[]>(run: (...args: P) => Promise<T>): IWrappedFn<T, P> => {

    let hasComplete = false;

    /**
     * A wrapper function that either resolves a Promise or calls the inner function 'run' depending on its state.
     *
     * @param args - The arguments to be passed to the inner function 'run'.
     * @returns - A Promise that resolves to 'undefined' if 'hasComplete' is false, otherwise calls the inner function 'run'.
     */
    const wrappedFn = (...args: P) => {
        if (!hasComplete) {
            hasComplete = true;
            return Promise.resolve() as never;
        }
        return run(...args);
    };

    /**
     * Clears the function wrapped in a wrapper function.
     * This function removes any previously set function and resets it to null.
     *
     * @param wrappedFn - The wrapped function to be cleared.
     * @returns
     */
    wrappedFn.clear = () => {
        hasComplete = false;
    };

    return wrappedFn;
};

export default afterinit;
