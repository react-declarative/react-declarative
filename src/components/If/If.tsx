import * as React from 'react';

import { useLayoutEffect, useEffect, useRef, useState } from 'react';

import cancelable, { IWrappedFn, CANCELED_SYMBOL } from '../../utils/hof/cancelable';
import { promiseValue } from '../../utils/promiseState';

import useActualValue from '../../hooks/useActualValue';

export interface IIfProps<T extends any = object> {
    Else?: React.ReactNode;
    condition:  boolean | ((payload: T) => boolean | Promise<boolean>);
    children: React.ReactNode;
    fallback?: (e: Error) => void;
    onLoadStart?: () => void;
    onLoadEnd?: (isOk: boolean) => void;
    payload?: T;
    deps?: any[];
    throwError?: boolean;
}

const resolvePass = <T extends any = object>(condition: IIfProps<T>['condition'], payload: IIfProps<T>['payload']) => {
    let result: boolean | null = false;
    if (typeof condition === 'function') {
        const resolve = condition(payload!);
        result = promiseValue(resolve);
    }
    return !!result;
};

export const If = <T extends any = object>({
    Else = null,
    children,
    condition,
    fallback,
    onLoadStart,
    onLoadEnd,
    payload,
    deps = [],
    throwError = false,
}: IIfProps<T>) => {

    const [pass, setPass] = useState(() => resolvePass(condition, payload));
    const executionRef = useRef<IWrappedFn<boolean> | null>(null);

    const isMounted = useRef(true);

    useLayoutEffect(() => () => {
      isMounted.current = false;
    }, []);

    const condition$ = useActualValue(condition);

    useEffect(() => {

        const { current: condition } = condition$;

        if (executionRef.current) {
            executionRef.current.cancel();
        }

        const execute = cancelable(async () => {
            let isOk = true;
            onLoadStart && onLoadStart();
            try {
                if (typeof condition === 'function') {
                    return await Promise.resolve(condition(payload!));
                } else {
                    return condition;
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
            try {
                const result = await execute();
                if (result === CANCELED_SYMBOL) {
                    return;
                }
                executionRef.current = null;
                isMounted.current && setPass(result);
            } catch (e) {
                isMounted.current && setPass(false);
                if (!throwError) {
                    fallback && fallback(e as Error);
                } else {
                    throw e;
                }
            }
        };

        process();
    }, [payload, ...deps]);


    if (pass) {
        return (
            <>
                {children}
            </>
        );
    } else {
        return (
            <>
                {Else}
            </>
        );
    }

};

export default If;
