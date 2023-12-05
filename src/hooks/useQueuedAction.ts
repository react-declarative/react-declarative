import { useLayoutEffect, useRef, useState, useCallback, useMemo } from 'react';

import queued from '../utils/hof/queued';

interface IParams {
    fallback?: (e: Error) => void;
    onLoadStart?: () => void;
    onLoadEnd?: (isOk: boolean) => void;
    throwError?: boolean;
}

interface IResult<Data extends any = any, Payload extends any = object> {
    loading: boolean;
    error: boolean;
    execute: (p?: Payload) => (Promise<Data | null>);
}

export const useQueuedAction = <Data extends any = any, Payload extends any = any>(run: (p: Payload) => (Data | Promise<Data>), {
    onLoadStart,
    onLoadEnd,
    fallback,
    throwError,
}: IParams = {}): IResult<Data, Payload> => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const isMounted = useRef(true);

    useLayoutEffect(() => () => {
      isMounted.current = false;
    }, []);

    const execution = useMemo(() => queued(async (payload: Payload) => {
        let isOk = true;
        onLoadStart && onLoadStart();
        try {
            const result = run(payload);
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
    }), []);

    const execute = useCallback(async (payload?: Payload) => {

        isMounted.current && setLoading(true);
        isMounted.current && setError(false);

        let isCanceled = false;

        try {
            return await execution(payload!);
        } catch (e) {
            isMounted.current && setError(true);
            if (!throwError) {
                fallback && fallback(e as Error);
            } else {
                throw e;
            }
        } finally {
            if (!isCanceled) {
                isMounted.current && setLoading(false);
            }
        }
        return null;
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

export default useQueuedAction;
