export const promiseState = <T = any>(promise: Promise<T> | T) => {
    let state: 'sync' | 'async' = 'async';
    Promise.resolve(promise).then(() => state = 'sync');
    return state as 'sync' | 'async';
};

export const promiseValue = <T = any>(promise: Promise<T> | T): T | null => {
    let value: T | null = null
    Promise.resolve(promise).then((result) => value = result);
    return value;
}

export default promiseState;
