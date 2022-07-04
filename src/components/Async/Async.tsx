import * as React from 'react';

import { useLayoutEffect, useEffect, useRef, useState } from 'react';

import cancelable, { IWrappedFn } from '../../utils/hof/cancelable';

export interface IAsyncProps<T extends any = object> {
    children: (p: T) => (Result | Promise<Result>);
    fallback?: (e: Error) => void;
    Loader?: React.ComponentType;
    Error?: React.ComponentType;
    onLoadStart?: () => void;
    onLoadEnd?: (isOk: boolean) => void;
    payload?: T;
    deps?: any[];
    throwError?: boolean;
}

type Result = React.ReactNode;

export const Async = <T extends any = object>({
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

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const isMounted = useRef(true);

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
            isMounted.current && setLoading(true);
            isMounted.current && setError(false);
            try {
                const result = await execute();
                executionRef.current = null;
                isMounted.current && setChild(result);
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
        };

        process();

    }, [payload, ...deps]);


    if (loading) {
        return <Loader />;
    } else if (error) {
        return <Error />;
    } else {
        return (
            <>
                {child}
            </>
        );
    }

};

export default Async;
