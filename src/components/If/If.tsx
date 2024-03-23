import * as React from 'react';

import { useLayoutEffect, useEffect, useRef, useState } from 'react';

import cancelable, { IWrappedFn, CANCELED_SYMBOL } from '../../utils/hof/cancelable';
import { promiseValue } from '../../utils/promiseState';

import useActualValue from '../../hooks/useActualValue';

/**
 * Represents the props for the IIf component.
 *
 * @template T - The type of the payload.
 */
export interface IIfProps<T extends any = object> {
    Else?: React.ReactNode;
    Loading?: React.ReactNode;
    condition:  boolean | ((payload: T) => boolean | Promise<boolean>);
    children: React.ReactNode;
    fallback?: (e: Error) => void;
    onLoadStart?: () => void;
    onLoadEnd?: (isOk: boolean) => void;
    payload?: T;
    deps?: any[];
    throwError?: boolean;
}

/**
 * Resolves a condition with a payload and returns a boolean result.
 *
 * @template T - The type of the payload.
 * @param condition - The condition to evaluate.
 * @param payload - The payload to pass to the condition.
 * @returns - The resolved result.
 */
const resolvePass = <T extends any = object>(condition: IIfProps<T>['condition'], payload: IIfProps<T>['payload']) => {
    let result: boolean | null = false;
    if (typeof condition === 'function') {
        const resolve = condition(payload!);
        result = promiseValue(resolve);
    }
    return !!result;
};

/**
 * A conditional rendering component with asynchronous support.
 *
 * @template T - The type of payload passed to the condition.
 * @param props - The props object.
 * @param props.Else - The content to render if the condition is false and not loading.
 * @param [props.Loading=props.Else] - The content to render while loading.
 * @param props.children - The content to render if the condition is true.
 * @param props.condition - The condition to evaluate. Can be a function that accepts the payload or a static value.
 * @param [props.fallback] - The function to call if an error occurs and `throwError` is false.
 * @param [props.onLoadStart] - The function to call when loading starts.
 * @param [props.onLoadEnd] - The function to call when loading ends. Receives a boolean indicating if the operation was successful.
 * @param [props.payload] - The payload to pass to the condition function.
 * @param [props.deps=[]] - The dependencies to include in the useEffect hook.
 * @param [props.throwError=false] - Whether to throw an error or call the fallback function if an error occurs.
 * @returns - The rendered content based on the condition and loading state.
 */
export const If = <T extends any = object>({
    Else = null,
    Loading = Else,
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
    const [loading, setLoading] = useState(0);
    const executionRef = useRef<IWrappedFn<boolean> | null>(null);

    const isMounted = useRef(true);

    useLayoutEffect(() => () => {
      isMounted.current = false;
    }, []);

    const condition$ = useActualValue(condition);

    /**
     * Function that handles the load start event.
     *
     * @function handleLoadStart
     * @returns
     */
    const handleLoadStart = () => {
        setLoading((loading) => loading + 1);
        onLoadStart && onLoadStart();
    };

    /**
     * Decrements the loading count and calls the onLoadEnd handler if it exists.
     *
     * @param isOk - Indicates whether loading was successful or not.
     * @returns
     */
    const handleLoadEnd = (isOk: boolean) => {
        setLoading((loading) => loading - 1);
        onLoadEnd && onLoadEnd(isOk);
    };

    useEffect(() => {

        const { current: condition } = condition$;

        if (executionRef.current) {
            executionRef.current.cancel();
        }

        /**
         * Executes a cancelable asynchronous function.
         *
         * @param {function} fn - The cancelable function to be executed.
         *
         */
        const execute = cancelable(async () => {
            let isOk = true;
            handleLoadStart();
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
                handleLoadEnd(isOk);
            }
        });

        executionRef.current = execute;

        /**
         * Asynchronous function that executes a process.
         *
         * @returns A promise that resolves when the process is complete.
         * @throws {Error} If an error occurs and `throwError` is `true`.
         */
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
    } else if (loading) {
        return (
            <>
                {Loading}
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
