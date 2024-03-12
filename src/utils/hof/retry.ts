import cancelable, { CANCELED_SYMBOL } from "./cancelable";

export interface IWrappedFn<T extends any = any, P extends any[] = any> {
    (...args: P): Promise<T | typeof CANCELED_SYMBOL>;
    cancel(): void;
};

/**
 * Retries a function multiple times until it succeeds or reaches the maximum number of retries.
 *
 * @param run - The function to run.
 * @param count - The maximum number of retries (default is 5).
 * @returns - The wrapped function that can be canceled.
 */
export const retry = <T extends any = any, P extends any[] = any[]>(run: (...args: P) => Promise<T>, count = 5): IWrappedFn<T, P> => {
    const wrappedFn = cancelable(async (...args: any) => {
        let total = count;        
        const call = async (): Promise<any> => {
            try {
                return await run(...args);
            } catch (error) {
                if (--total === 0) {
                    throw error;
                }
                return await call();
            }
        };
        return await call();
    });
    return wrappedFn as unknown as IWrappedFn<T, P>;
};

export default retry;
