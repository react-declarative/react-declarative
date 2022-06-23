import * as React from 'react';

import { useLayoutEffect, useEffect, useRef, useState } from 'react';

export interface IIfProps<T extends any = object> {
    condition:  boolean | ((payload: T) => boolean | Promise<boolean>);
    children: React.ReactNode;
    fallback?: (e: Error) => void;
    onLoadStart?: () => void;
    onLoadEnd?: (isOk: boolean) => void;
    payload?: T;
    throwError?: boolean;
}

export const If = <T extends any = object>({
    children,
    condition,
    fallback,
    onLoadStart,
    onLoadEnd,
    payload,
    throwError = false,
}: IIfProps<T>) => {
    const [pass, setPass] = useState(false);

    const isMounted = useRef(true);

    useLayoutEffect(() => () => {
      isMounted.current = false;
    }, []);

    useEffect(() => {
        const process = async () => {
            let isOk = true;
            onLoadStart && onLoadStart();
            try {
                const result = typeof condition === 'function' ? await Promise.resolve(condition(payload!)) : condition;
                isMounted.current && setPass(result);
            } catch(e) {
                isOk = false;
                isMounted.current && setPass(false);
                if (!throwError) {
                    fallback && fallback(e as Error);
                } else {
                    throw e;
                }
            } finally {
                onLoadEnd && onLoadEnd(isOk);
            }
        };
        process();
    }, [payload]);


    if (pass) {
        return (
            <>
                {children}
            </>
        );
    } else {
        return null;
    }

};

export default If;
