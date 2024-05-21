/**
 * Represents an object used for awaiting a value or a promise.
 * 
 * @template T - The type of the value to be resolved.
 * 
 * @interface
 * @function
 * @param value - The value or promise to resolve.
 * @param reason - The reason for rejecting the promise.
 */
export interface IAwaiter<T extends unknown> {
    resolve(value: T | PromiseLike<T>): void;
    reject(reason?: any): void;
};

/**
 * Creates an awaiter object along with a promise.
 * 
 * @template T - The type of the value to be resolved.
 * 
 * @function
 * @returns An array containing the promise and the awaiter object.
 */
export const createAwaiter = <T extends unknown>(): [Promise<T>, IAwaiter<T>] => {
    let resolveRef: (value: T | PromiseLike<T>) => void = null as never;
    let rejectRef: (reason?: any) => void = null as never;

    const awaiter = new Promise<T>((resolve, reject) => {
        [resolveRef, rejectRef] = [resolve, reject];
    });

    const resolve: typeof resolveRef = (value) => resolveRef && resolveRef(value);
    const reject: typeof rejectRef = (value) => rejectRef && rejectRef(value); 

    return [awaiter, { resolve, reject }];
};

export default createAwaiter;
