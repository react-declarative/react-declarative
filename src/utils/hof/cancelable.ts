export interface IWrappedFn<T extends any = any, P extends any[] = any> {
    (...args: P): Promise<T | typeof CANCELED_SYMBOL>;
    cancel(): void;
};

export const CANCELED_SYMBOL = Symbol('cancelable-canceled');

export const cancelable = <T extends any = any, P extends any[] = any[]>(promise: (...args: P) => Promise<T>): IWrappedFn<T, P> => {

    let hasCanceled = false;

    const wrappedFn = (...args: P) => new Promise<T | typeof CANCELED_SYMBOL>((resolve, reject) => {
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
        hasCanceled = true;
    };

    return wrappedFn;

};

export default cancelable;
