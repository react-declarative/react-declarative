import * as React from 'react';

import { useLayoutEffect, useRef, useState } from 'react';

import { Value } from '../../model/IField';

interface IAsyncProps<T extends any = object> {
    children: (p: T) => (Value | Promise<Value>);
    fallback?: (e: Error) => void;
    LoaderModal?: React.ComponentType;
    payload?: T;
}

export const Async = <T extends any = object>({
    children,
    fallback = () => null,
    LoaderModal = () => null,
    payload,
}: IAsyncProps<T>) => {
    const [child, setChild] = useState<React.ReactNode>('');
    const [loading, setLoading] = useState(false);

    const isMounted = useRef(true);

    useLayoutEffect(() => () => {
      isMounted.current = false;
    }, []);

    useLayoutEffect(() => {
        const process = async () => {
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
            } finally {
                setLoading(false);
            }
        };
        process();
    }, [payload]);

    return (
        <>
            {loading && <LoaderModal />}
            {child}
        </>
    );
};

export default Async;
