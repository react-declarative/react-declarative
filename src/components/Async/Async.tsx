import * as React from 'react';

import { useLayoutEffect, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';

import cancelable, { IWrappedFn, CANCELED_SYMBOL } from '../../utils/hof/cancelable';

import useReloadTrigger from '../../hooks/useReloadTrigger';
import useSubject from '../../hooks/useSubject';

import TSubject from '../../model/TSubject';

/**
 * Represents the properties for an asynchronous component.
 * @template T - The type of the payload.
 */
export interface IAsyncProps<T extends any = object> {
    loading?: boolean;
    reloadSubject?: TSubject<void>;
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

/**
 * Async
 * @template T - The type of the payload data.
 * @param params - The parameters object.
 * @param params.reloadSubject - The subject used to trigger a reload of the async data.
 * @param params.loading - A boolean indicating whether the async data is currently being loaded.
 * @param params.children - The children component that renders the async data.
 * @param params.fallback - The fallback component to render in case of an error.
 * @param params.Loader - The loader component to render while the async data is being loaded.
 * @param params.Error - The error component to render in case of an error.
 * @param params.onLoadStart - A function to be called when the async data loading starts.
 * @param params.onLoadEnd - A function to be called when the async data loading ends.
 * @param params.payload - The payload data to be passed to the children component.
 * @param params.deps - The dependencies of the async data.
 * @param params.throwError - A boolean indicating whether to throw an error in case of an error or to fallback.
 * @returns - The rendered component.
 */
export const Async = <T extends any = object>({
    reloadSubject: upperReloadSubject,
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

    const { reloadTrigger, doReload } = useReloadTrigger();

    const reloadSubject = useSubject(upperReloadSubject);

    useEffect(() => reloadSubject.subscribe(() => {
        doReload();
    }), []);

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

        /**
         * Executes a cancelable asynchronous function.
         *
         * @function
         * @param {Function} fn - The asynchronous function to execute.
         * @returns {Promise} - A promise that resolves with the result of the function or null if the function returns undefined.
         * @throws {Error} - If an error occurs during execution of the function, it will be thrown.
         */
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

        /**
         * Executes a process asynchronously.
         *
         * @returns A promise that resolves when the process completes.
         * @throws {Error} If an error occurs and throwError is set to true.
         */
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

    }, [payload, ...deps, reloadTrigger]);


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
