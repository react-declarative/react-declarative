import Observer, { TObserver, LISTEN_CONNECT } from "../Observer";

/**
 * Creates an observable that emits the result of a given promise callback function.
 *
 * @param {Function} callbackfn - The callback function that returns a promise.
 * @param {Function} [fallbackfn] - The fallback function to handle errors if the promise rejects.
 * @returns {Observer} - The observable observer.
 *
 * @template Data - The type of data emitted by the observer.
 */
export const fromPromise = <Data = any>(callbackfn: () => Promise<Data>, fallbackfn?: (e: Error) => void): TObserver<Data> => {
    let isCanceled = false;
    const observer = new Observer(() => {
        isCanceled = true;
    });
    const process = async () => {
        try {
            const result = await callbackfn();
            if (!isCanceled) {
                observer.emit(result);
            }
        } catch (e: any) {
            if (fallbackfn) {
                fallbackfn(e);
            } else {
                throw e;
            }
        }
    };
    observer[LISTEN_CONNECT](() => {
        process();
    });
    return observer;
};

export default fromPromise;
