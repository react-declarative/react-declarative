import { useLayoutEffect, useRef, useState, useCallback } from 'react';

import cancelable, { IWrappedFn, CANCELED_SYMBOL } from '../utils/hof/cancelable';
import useActualCallback from './useActualCallback';

/**
 * Interface for defining optional parameters for a function.
 *
 * @typedef IParams
 * @property [fallback] - Function to handle error if it occurs.
 * @property [onLoadStart] - Function to be called when loading starts.
 * @property [onLoadEnd] - Function to be called when loading ends,
 *                                                  with a boolean indicating if it was successful or not.
 * @property [throwError] - Whether to throw an error or not.
 */
interface IParams {
    fallback?: (e: Error) => void;
    onLoadStart?: () => void;
    onLoadEnd?: (isOk: boolean) => void;
    throwError?: boolean;
}

/**
 * Represents the result of an operation.
 *
 * @template Data - The type of data returned by the operation.
 * @template Payload - The type of payload accepted by the execute method.
 */
export interface IResult<Data extends any = any, Payload extends any = object> {
    loading: boolean;
    error: boolean;
    execute: (p?: Payload) => (Promise<Data | null>);
}

/**
 * Executes an asynchronous action with options for handling loading, error, and cancellation.
 *
 * @template Data - The data type returned by the action.
 * @template Payload - The payload type passed to the action.
 * @param run - The action function to execute.
 * @param options - Optional parameters for customizing behavior.
 * @param options.onLoadStart - A callback function to run when the action starts loading.
 * @param options.onLoadEnd - A callback function to run when the action finishes loading.
 * @param options.fallback - A callback function to handle errors when throwError is set to false.
 * @param options.throwError - Whether to throw an error when the action fails.
 * @returns - An object containing loading, error, and execute properties.
 */
export const useAsyncAction = <Data extends any = any, Payload extends any = any>(run: (p: Payload) => (Data | Promise<Data>), {
    onLoadStart,
    onLoadEnd,
    fallback,
    throwError,
}: IParams = {}): IResult<Data, Payload> => {

    const executionRef = useRef<IWrappedFn<Data | null> | null>(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const isMounted = useRef(true);

    useLayoutEffect(() => () => {
      isMounted.current = false;
    }, []);

    const run$ = useActualCallback(run);

    /**
     * Executes a given payload asynchronously.
     * @param payload - The payload to be executed.
     * @returns - The result of the execution, or null if canceled.
     */
    const execute = useCallback(async (payload?: Payload) => {
        if (executionRef.current) {
            executionRef.current.cancel();
        }

        /**
         * Executes a cancelable function with the given onLoadStart and onLoadEnd callbacks.
         * The function can return a Promise or a value. If it returns a Promise,
         * the function waits for the Promise to resolve before returning the result.
         * If the function throws an error, it also calls onLoadEnd with an isOk flag set to false.
         *
         * @template T - The type of the result data.
         * @param func - The cancelable function to execute.
         * @param onLoadStart - The callback function called before the execution of the function.
         * @param onLoadEnd - The callback function called after the execution of the function.
         * @returns - A Promise that resolves with the result of the function, or null if the function did not return anything.
         * @throws - If the executed function throws an error, it will be rethrown.
         */
        const execution = cancelable<Data | null>(async () => {
            let isOk = true;
            onLoadStart && onLoadStart();
            try {
                const result = run$(payload!);
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

        executionRef.current = execution;

        isMounted.current && setLoading(true);
        isMounted.current && setError(false);

        let isCanceled = false;

        try {
            const result = await execution();
            if (result === CANCELED_SYMBOL) {
                isCanceled = true;
                return null;
            }
            executionRef.current = null;
            return result;
        } catch (e) {
            isMounted.current && setError(true);
            if (!throwError) {
                fallback && fallback(e as Error);
            } else {
                throw e;
            }
        } finally {
            if (!isCanceled) {
                isMounted.current && setLoading(false);
            }
        }
        return null;
    }, []);

    return {
        loading,
        error,
        execute,
    };
};

export default useAsyncAction;
