import { useEffect } from 'react';

interface IParams {
    onLoadStart?: () => void;
    onLoadEnd?: (isOk: boolean) => void;
    fallback?: (e: Error) => void;
    throwError?: boolean;
    deps?: any[];
}

const execute = async (promise: Promise<any>, {
    onLoadStart,
    onLoadEnd,
    fallback,
    throwError,
}: IParams) => {
    let isOk = true;
    onLoadStart && onLoadStart();
    try {
        await promise;
    } catch (e) {
        isOk = false;
        if (throwError) {
            throw e;
        } else {
            fallback && fallback(e as Error);
        }
    } finally {
        onLoadEnd && onLoadEnd(isOk);
    }
};

export const useOnce = (fn: () => (void | Promise<any> | (() => void)), params: IParams = {}) => {
    useEffect(() => {
        const result = fn();
        if (result instanceof Promise) {
            execute(result, params);
            return undefined;
        }
        return result;
    }, params.deps || []);
};

export default useOnce;
