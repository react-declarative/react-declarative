export interface IAwaiter<T extends unknown> {
    resolve(value: T | PromiseLike<T>): void;
    reject(reason?: any): void;
};

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
