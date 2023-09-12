import * as React from 'react';

import { useLayoutEffect, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';

import cancelable, { IWrappedFn, CANCELED_SYMBOL } from '../../utils/hof/cancelable';

export interface IAsyncProps<T extends any = object> {
    loading?: boolean;
    children: (p: T) => (Result | Promise<Result>);
    fallback?: (e: Error) => void;
    Loader?: React.ComponentType<any>;
    Error?: React.ComponentType<any>;
    onLoadStart?: () => void;
    onLoadEnd?: (isOk: boolean) => void;
    payload?: T;
    deps?: any[];
    throwError?: boolean;
}

type Result = React.ReactNode | void;

export const Async = <T extends any = object>({
    loading: upperLoading,
    children,
    fallback,
    Loader = () => null,
    Error = () => null,
    onLoadStart,
    onLoadEnd,
    payload,
    deps = [],
    throwError = false,
}: IAsyncProps<T>) => {

    const [child, setChild] = useState<Result>('');

    const executionRef = useRef<IWrappedFn<Result> | null>(null);

    const [currentLoading, setCurrentLoading] = useState(false);
    const [error, setError] = useState(false);

    const isMounted = useRef(true);

    const loading = upperLoading || currentLoading;

    useLayoutEffect(() => () => {
      isMounted.current = false;
    }, []);

    useEffect(() => {
        
        if (executionRef.current) {
            executionRef.current.cancel();
        }

        const execute = cancelable(async () => {
            let isOk = true;
            onLoadStart && onLoadStart();
            try {
                const result = children(payload!);
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

        executionRef.current = execute;

        const process = async () => {
            let isCanceled = false;
            isMounted.current && setCurrentLoading(true);
            isMounted.current && setError(false);
            try {
                const result = await execute();
                if (result === CANCELED_SYMBOL) {
                    isCanceled = true;
                    return;
                }
                executionRef.current = null;
                if (isMounted.current) {
                    /** react-18 prevent batching */
                    queueMicrotask(() => flushSync(() => {
                        setChild(result);
                    }));
                }
            } catch (e) {
                isMounted.current && setError(true);
                if (!throwError) {
                    fallback && fallback(e as Error);
                } else {
                    throw e;
                }
            } finally {
                if (!isCanceled) {
                    isMounted.current && setCurrentLoading(false);
                }
            }
        };

        process();

    }, [payload, ...deps]);


    if (loading) {
        return <Loader payload={payload} />;
    } else if (error) {
        return <Error payload={payload} />;
    } else {
        return (
            <>
                {child}
            </>
        );
    }

};

export default Async;
