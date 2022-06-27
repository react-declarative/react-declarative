export interface IWrappedFn<T extends any = any, P extends any[] = any> {
    (...args: P): Promise<T>;
    cancel(): void;
};

export const cancelable = <T extends any = any, P extends any[] = any>(promise: (...args: P) => Promise<T>): IWrappedFn<T, P> => {

    let hasCanceled = false;

    const wrappedFn = (...args: P) => new Promise<T>((resolve, reject) => {
        const result = promise(...args);
        result.then((val) => {
            if (!hasCanceled) {
                resolve(val)
            }
        });
        result.catch((error) => {
            if (!hasCanceled) {
                reject(error)
            }
        });
    });

    wrappedFn.cancel = () => {
        hasCanceled = true;
    };

    return wrappedFn;

};

export default cancelable;
