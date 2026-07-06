/**
 * Determines the state of a given promise.
 *
 * @param promise - The promise to check the state of.
 *
 * @returns - The state of the promise, which can be either 'sync' or 'async'.
 */
export const promiseState = <T = any>(promise: Promise<T> | T): 'sync' | 'async' => {
    return promise instanceof Promise ? 'async' : 'sync';
};

/**
 * Returns the value immediately if it is not a promise, otherwise returns null.
 *
 * @param promise - The value or promise to unwrap.
 * @returns - The value for synchronous input, null for asynchronous input.
 */
export const promiseValue = <T = any>(promise: Promise<T> | T): T | null => {
    if (promise instanceof Promise) {
        return null;
    }
    return promise;
}

export default promiseState;
