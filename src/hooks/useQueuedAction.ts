import { useLayoutEffect, useRef, useState, useMemo } from 'react';

import queued, { CANCELED_SYMBOL } from '../utils/hof/queued';

import useActualCallback from './useActualCallback';

interface IParams {
    fallback?: (e: Error) => void;
    onLoadStart?: () => void;
    onLoadEnd?: (isOk: boolean) => void;
    throwError?: boolean;
}

export interface IResult<Data extends any = any, Payload extends any = object> {
    loading: boolean;
    error: boolean;
    execute: IExecute<Data, Payload>;
}

export interface IExecute<Data extends any = any, Payload extends any = object> {
    (payload?: Payload): Promise<Data | null>;
    clear(): void;
    cancel(): void;
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

    const run$ = useActualCallback(run);

    const execution = useMemo(() => queued(async (payload: Payload) => {
        let isOk = true;
        onLoadStart && onLoadStart();
        try {
            const result = run$(payload);
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

    const execute = useMemo(() => async (payload?: Payload) => {

        isMounted.current && setLoading(true);
        isMounted.current && setError(false);

        try {
            const result = await execution(payload!);
            if (result === CANCELED_SYMBOL) {
                return null;
            }
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
        return null;
    }, []);

    Object.assign(execute, {
        clear() {
            execution.clear();
        },
        cancel() {
            execution.cancel();
        }
    });

    return {
        loading,
        error,
        execute: execute as IExecute<Data, Payload>,
    };
};

export { CANCELED_SYMBOL };

export default useQueuedAction;