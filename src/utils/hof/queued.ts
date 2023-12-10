import { CANCELED_SYMBOL } from "./cancelable";

import compose, { Function } from "../compose";

export interface IWrappedFn<T extends any = any, P extends any[] = any> {
    (...args: P): Promise<T | typeof CANCELED_SYMBOL>;
    clear(): void;
    cancel(): void;
};

export const queued = <T extends any = any, P extends any[] = any[]>(promise: (...args: P) => Promise<T>): IWrappedFn<T, P> => {

    let lastPromise: Promise<any> = Promise.resolve();
    let cancelFn: Function | undefined = undefined;

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

    wrappedFn.clear = () => {
        lastPromise = Promise.resolve();
    };

    wrappedFn.cancel = () => {
        wrappedFn.clear();
        cancelFn && cancelFn();
        cancelFn = undefined;
    };

    return wrappedFn;
};

export { CANCELED_SYMBOL };

export default queued;
