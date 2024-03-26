/**
 * Represents a wrapped function that returns a promise.
 * @template T - The type of the result of the wrapped function.
 * @template P - The types of the parameters of the wrapped function.
 */
export interface IWrappedFn<T extends any = any, P extends any[] = any> {
    (...args: P): Promise<T | typeof CANCELED_SYMBOL>;
    cancel(): void;
};

/**
 * Symbol representing cancellation status.
 *
 * @type {Symbol}
 * @name CANCELED_SYMBOL
 */
export const CANCELED_SYMBOL = Symbol('cancelable-canceled');

/**
 * Wraps a promise function and provides cancellation functionality.
 *
 * @param promise - The promise function to wrap.
 * @returns The wrapped function with cancellation capability.
 * @template T - The type of the promise's resolved value.
 * @template P - The type of the promise function's arguments.
 */
export const cancelable = <T extends any = any, P extends any[] = any[]>(promise: (...args: P) => Promise<T>): IWrappedFn<T, P> => {

    let cancelRef: Function | undefined;

    /**
     * A function that wraps a given promise with cancellation functionality.
     *
     * @template P - The type of the arguments passed to the wrapped function.
     * @template T - The type of the resolved value of the promise.
     * @param promise - The promise to be wrapped.
     * @returns A promise that resolves with the resolved value of the given promise, or with the symbol `CANCELED_SYMBOL` if the wrapped function's
     * cancellation is triggered.
     */
    const wrappedFn = (...args: P) => new Promise<T | typeof CANCELED_SYMBOL>((resolve, reject) => {
        let hasCanceled = false;
        cancelRef && cancelRef();
        cancelRef = () => hasCanceled = true;
        const result = promise(...args);
        result.then((val) => {
            if (!hasCanceled) {
                resolve(val);
                return;
            }
            resolve(CANCELED_SYMBOL);
        });
        result.catch((error) => {
            if (!hasCanceled) {
                reject(error);
                return;
            }
            resolve(CANCELED_SYMBOL);
        });
    });

    /**
     * Cancels the execution of the wrapped function.
     *
     * @function
     * @name wrappedFn.cancel
     * @returns
     */
    wrappedFn.cancel = () => {
        cancelRef && cancelRef();
    };

    return wrappedFn;

};

export default cancelable;
