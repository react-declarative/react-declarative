export interface IWrappedFn<T extends any = any, P extends any[] = any> {
    (...args: P): Promise<T | typeof CANCELED_SYMBOL>;
    cancel(): void;
};

export const CANCELED_SYMBOL = Symbol('cancelable-canceled');

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
