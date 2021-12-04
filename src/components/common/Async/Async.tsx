import * as React from 'react';

import { useLayoutEffect, useRef, useState } from 'react';

import { Value } from '../../../model/IField';

interface IAsyncProps<T extends any = object> {
    children: (p: T) => (Value | Promise<Value>);
    fallback?: (e: Error) => void;
    payload?: T;
}

export const Async = <T extends any = object>({
    children,
    fallback = () => null,
    payload = {} as T,
}: IAsyncProps<T>) => {
    const [child, setChild] = useState<string>('');

    const isMounted = useRef(true);

    useLayoutEffect(() => () => {
      isMounted.current = false;
    }, []);

    useLayoutEffect(() => {
        const process = async () => {
            try {
                const newChild = await Promise.resolve(children(payload!));
                isMounted.current && setChild((newChild || '').toString());
            } catch(e) {
                fallback(e as Error);
            }
        };
        process();
    }, [children, fallback, payload]);

    return (
        <>
            {child}
        </>
    );
};

export default Async;
