import * as React from 'react';

import { useLayoutEffect, useEffect, useRef, useState } from 'react';

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

    useEffect(() => {
        const process = async () => {
            let isOk = true;
            isMounted.current && setError(false);
            onLoadStart && onLoadStart();
            try {
                const result = children(payload!);
                if (result instanceof Promise) {
                    isMounted.current && setLoading(true);
                    isMounted.current && setChild((await result) || null);
                } else {
                    isMounted.current && setChild(result || null);
                }
            } catch(e) {
                fallback(e as Error);
                isMounted.current && setError(true);
                isOk = false;
            } finally {
                isMounted.current && setLoading(false);
                onLoadEnd && onLoadEnd(isOk);
            }
        };
        process();
    }, [payload]);


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
