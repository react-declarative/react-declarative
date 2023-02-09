import { useLayoutEffect, useRef, useState, useCallback } from 'react';

import cancelable, { IWrappedFn } from '../utils/hof/cancelable';

interface IParams {
    fallback?: (e: Error) => void;
    onLoadStart?: () => void;
    onLoadEnd?: (isOk: boolean) => void;
    throwError?: boolean;
}

interface IResult<T extends any = object> {
    loading: boolean;
    error: boolean;
    execute: (p: T) => Promise<any>;
}

export const useAsyncAction = <T extends any = object>(run: (p: T) => (any | Promise<any>), {
    onLoadStart,
    onLoadEnd,
    fallback,
    throwError,
}: IParams): IResult<T> => {

    const executionRef = useRef<IWrappedFn<any> | null>(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const isMounted = useRef(true);

    useLayoutEffect(() => () => {
      isMounted.current = false;
    }, []);

    const execute = useCallback(async (payload: T) => {
        if (executionRef.current) {
            executionRef.current.cancel();
        }

        const execution = cancelable(async () => {
            let isOk = true;
            onLoadStart && onLoadStart();
            try {
                const result = run(payload!);
                if (result instanceof Promise) {
                    return (await result) || null;
                } else {
                    return result || null;
                }
            } catch (e) {
                isOk = false;
                throw e;
            } finally {
                onLoadEnd && onLoadEnd(isOk);
            }
        });

        executionRef.current = execution;

        isMounted.current && setLoading(true);
        isMounted.current && setError(false);

        try {
            const result = await execution();
            executionRef.current = null;
            return result;
        } catch (e) {
            isMounted.current && setError(true);
            if (!throwError) {
                fallback && fallback(e as Error);
            } else {
                throw e;
            }
        } finally {
            isMounted.current && setLoading(false);
        }

    }, [
        run,
        onLoadStart,
        onLoadEnd,
        fallback,
        throwError,
    ]);

    return {
        loading,
        error,
        execute,
    };
};

export default useAsyncAction;
