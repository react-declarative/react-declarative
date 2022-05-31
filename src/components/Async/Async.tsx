import * as React from 'react';

import { useLayoutEffect, useRef, useState } from 'react';

export interface IAsyncProps<T extends any = object> {
    children: (p: T) => (React.ReactNode | Promise<React.ReactNode>);
    fallback?: (e: Error) => void;
    Loader?: React.ComponentType;
    Error?: React.ComponentType;
    onLoadStart?: () => void;
    onLoadEnd?: (isOk: boolean) => void;
    payload?: T;
}

export const Async = <T extends any = object>({
    children,
    fallback = () => null,
    Loader = () => null,
    Error = () => null,
    onLoadStart,
    onLoadEnd,
    payload,
}: IAsyncProps<T>) => {
    const [child, setChild] = useState<React.ReactNode>('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const isMounted = useRef(true);

    useLayoutEffect(() => () => {
      isMounted.current = false;
    }, []);

    useLayoutEffect(() => {
        const process = async () => {
            let isOk = true;
            setError(false);
            onLoadStart && onLoadStart();
            try {
                const result = children(payload!);
                if (result instanceof Promise) {
                    setLoading(true);
                    isMounted.current && setChild((await result) || null);
                } else {
                    isMounted.current && setChild(result || null);
                }
            } catch(e) {
                fallback(e as Error);
                setError(true);
                isOk = false;
            } finally {
                setLoading(false);
                onLoadEnd && onLoadEnd(isOk);
            }
        };
        process();
    }, [payload]);

    return (
        <>
            {loading && <Loader />}
            {error && <Error />}
            {child}
        </>
    );
};

export default Async;
