import { useEffect, useState } from 'react';

import IOneProps, { 
    OneHandler,
} from "../../../model/IOneProps";

import IAnything from "../../../model/IAnything";

/**
 * Represents the parameters for a local handler
 *
 * @template Data - The type of data to be returned
 * @template Payload - The type of payload for the local handler
 */
export interface ILocalHandlerParams<Data extends IAnything = IAnything, Payload extends IAnything = IAnything> {
    payload?: Payload;
    resultMap?: (json: Record<string, any> | null) => Data | null;
    onLoadBegin?: () => void;
    onLoadEnd?: (isOk: boolean) => void;
    fallback?: (e: Error) => void;
}

/**
 * Represents the result of handling a local operation.
 * @template Data - The type of data returned by the operation.
 */
export interface ILocalHandlerResult<Data extends IAnything = IAnything> {
    data: Data | null;
    change: IOneProps<Data>['change'];
}

const EMPTY_RESPONSE = null;

const resolveHandler = async <Data = IAnything, Payload = IAnything>(handler: OneHandler<Data, Payload>, payload: Payload): Promise<Data | null> => {
    if (typeof handler === 'function') {
        const result = (handler as Function)(payload);
        return result instanceof Promise ? (await result) : result;
    } else {
        return handler;
    }
};

/**
 * Executes a local handler function and manages the state of the data.
 *
 * @template Data - The type of the data that will be stored in the state.
 * @template Payload - The type of the payload that will be passed to the handler function.
 *
 * @param handler - The handler function to be executed.
 * @param options - Additional options for the local handler.
 * @param options.resultMap - Optional. A function to transform the data before storing it in the state.
 * @param options.payload - Optional. The payload to be passed to the handler function.
 * @param options.onLoadBegin - Optional. A callback function to be executed before the handler function.
 * @param options.onLoadEnd - Optional. A callback function to be executed after the handler function.
 * @param options.fallback - Optional. A fallback function to handle errors.
 *
 * @returns - An object containing the data and a function to change the data.
 */
export const useLocalHandler = <Data extends IAnything = IAnything, Payload extends IAnything = IAnything>(handler: OneHandler<Data, Payload>, {
    resultMap = (data) => data as Data,
    payload,
    onLoadBegin,
    onLoadEnd,
    fallback,
}: ILocalHandlerParams<Data> = {}): ILocalHandlerResult<Data> => {

    const [data, setData] = useState<Data | null>(null);

    useEffect(() => {
        /**
         * Executes a process asynchronously.
         *
         * The process function is executed in an asynchronous manner. It handles the loading state, data retrieval, error handling, and completion state.
         *
         * @return - A Promise that resolves when the process is completed.
         */
        const process = async () => {
            onLoadBegin && onLoadBegin();
            let isOk = true;
            try {
                const data = await resolveHandler<Data>(handler, payload);
                setData(resultMap((data || {}) as Record<string, any>));
            } catch (e) {
                isOk = false;
                if (fallback) {
                    fallback(e as Error);
                    setData(EMPTY_RESPONSE);
                } else {
                    throw e;
                }
            } finally {
                onLoadEnd && onLoadEnd(isOk);
            }
        };
        process();
    }, []);

    const change = (data: Data, initial: boolean) => {
        if (!initial) {
            setData(data);
        }
    };

    return {
        data,
        change,
    };
};

export default useLocalHandler;
