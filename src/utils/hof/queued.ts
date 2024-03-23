import { CANCELED_SYMBOL } from "./cancelable";

import compose, { Function } from "../compose";

export interface IWrappedFn<T extends any = any, P extends any[] = any> {
    (...args: P): Promise<T | typeof CANCELED_SYMBOL>;
    clear(): void;
    cancel(): void;
};

/**
 * Creates a wrapper function for a Promise that allows for cancellation and clearing of queued Promises.
 *
 * @template T - The resolved value of the Promise.
 * @template P - The types of the arguments passed to the promise function.
 * @param promise - The promise function to be wrapped.
 * @returns - The wrapped function.
 */
export const queued = <T extends any = any, P extends any[] = any[]>(promise: (...args: P) => Promise<T>): IWrappedFn<T, P> => {

    let lastPromise: Promise<any> = Promise.resolve();
    let cancelFn: Function | undefined = undefined;

    /**
     * Executes a promise function with the given arguments, allowing cancellation and clearing.
     * @template P - The tuple type of the arguments passed to the promise function.
     * @param promise - The promise function to be executed.
     * @param args - The arguments to be passed to the promise function.
     * @returns - A promise that resolves with the result of the promise function or CANCELED_SYMBOL if canceled.
     */
    const wrappedFn = (...args: P) => {
        let isCanceled = false;
        const cancel: Function = () => { isCanceled = true };
        cancelFn = cancelFn ? compose(cancelFn, cancel) : cancel;
        lastPromise = lastPromise
            .then(async () => {
                if (!isCanceled) {
                    return await promise(...args)
                }
                return CANCELED_SYMBOL;
            })
            .finally(() => {
                wrappedFn.clear();
                cancelFn = undefined;
            });
        return lastPromise;
    };

    /**
     * Clears any existing wrapped function stored in the wrappedFn variable.
     * This function is used to reset the wrapped function to its initial state.
     *
     * @function clear
     */
    wrappedFn.clear = () => {
        lastPromise = Promise.resolve();
    };

    /**
     * Cancels the execution of the wrapped function.
     * Once called, the wrapped function will not be executed.
     *
     * @function cancel
     * @memberof wrappedFn
     *
     */
    wrappedFn.cancel = () => {
        wrappedFn.clear();
        cancelFn && cancelFn();
        cancelFn = undefined;
    };

    return wrappedFn;
};

export { CANCELED_SYMBOL };

export default queued;
