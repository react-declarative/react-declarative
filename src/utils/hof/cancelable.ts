export interface IWrappedFn<T extends any = any, P extends any[] = any> {
    (...args: P): Promise<T | typeof CANCELED_SYMBOL>;
    cancel(): void;
};

export const CANCELED_SYMBOL = Symbol('cancelable-canceled');

/**
 * Wraps a promise function and provides cancellation functionality.
 *
 * @param {(...args: P) => Promise<T>} promise - The promise function to wrap.
 * @returns {IWrappedFn<T, P>} The wrapped function with cancellation capability.
 * @template T - The type of the promise's resolved value.
 * @template P - The type of the promise function's arguments.
 */
export const cancelable = <T extends any = any, P extends any[] = any[]>(promise: (...args: P) => Promise<T>): IWrappedFn<T, P> => {

    let cancelRef: Function | undefined;

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

    wrappedFn.cancel = () => {
        cancelRef && cancelRef();
    };

    return wrappedFn;

};

export default cancelable;
