import { useLayoutEffect, useRef, useState, useMemo } from 'react';

import singlerun from '../utils/hof/singlerun';

import useActualCallback from './useActualCallback';

/**
 * @typedef {Object} IParams
 * @property [fallback] - The function to be called when an error occurs.
 * @property [onLoadStart] - The function to be called when the load starts.
 * @property [onLoadEnd] - The function to be called when the load ends.
 * @property [throwError=false] - Determines if an error should be thrown.
 */
interface IParams {
    fallback?: (e: Error) => void;
    onLoadStart?: () => void;
    onLoadEnd?: (isOk: boolean) => void;
    throwError?: boolean;
}

/**
 * Interface representing the result of an operation.
 *
 * @template Data - The type of the data returned by the operation.
 * @template Payload - The type of the payload used for the operation.
 */
interface IResult<Data extends any = any, Payload extends any = object> {
    loading: boolean;
    error: boolean;
    execute: IExecute<Data, Payload>;
}

/**
 * Represents an interface for executing an action with a payload and returning data asynchronously.
 * @template Data - The type of data returned by the execution.
 * @template Payload - The type of payload accepted by the execution.
 */
export interface IExecute<Data extends any = any, Payload extends any = object> {
    (payload?: Payload): Promise<Data | null>;
    clear(): void;
}

/**
 * Function useSinglerunAction
 *
 * @description This function is a custom hook that helps to handle asynchronous actions and manage loading and error states.
 *
 * @template Data - The type of data that the asynchronous action will return.
 * @template Payload - The type of payload that the asynchronous action accepts.
 *
 * @param run - The asynchronous action to be executed.
 * @param options - Additional options for the hook.
 * @param [options.onLoadStart] - Callback function called when the asynchronous action starts.
 * @param [options.onLoadEnd] - Callback function called when the asynchronous action ends.
 * @param [options.fallback] - Callback function called when an error occurs, if `throwError` is set to `false`.
 * @param [options.throwError] - Flag to determine whether to throw an error or call the `fallback` function when an error occurs. Default is `true`.
 *
 * @returns - An object containing the loading state, error state, and an `execute` function to execute the asynchronous action.
 */
export const useSinglerunAction = <Data extends any = any, Payload extends any = any>(run: (p: Payload) => (Data | Promise<Data>), {
    onLoadStart,
    onLoadEnd,
    fallback,
    throwError,
}: IParams = {}): IResult<Data, Payload> => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const isMounted = useRef(true);

    const run$ = useActualCallback(run);

    useLayoutEffect(() => () => {
      isMounted.current = false;
    }, []);

    /**
     * Executes a function asynchronously using the useMemo hook.
     *
     * @param callback - The function to be executed asynchronously.
     *
     * @returns - The result of the execution.
     */
    const execute = useMemo(() => singlerun(async (payload?: Payload) => {

        const execution = async () => {
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
        };

        isMounted.current && setLoading(true);
        isMounted.current && setError(false);

        let isCanceled = false;

        try {
            return await execution();
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
    }), []);

    return {
        loading,
        error,
        execute,
    };
};

export default useSinglerunAction;
