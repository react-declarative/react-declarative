import { useMemo } from 'react';

import { 
    OneHandler,
} from "../../../model/IOneProps";

import IAnything from "../../../model/IAnything";

/**
 * Interface defining the properties of the IStaticHandlerParams class.
 * @template Data - The type of data expected from the resultMap function.
 */
export interface IStaticHandlerParams<Data extends IAnything = IAnything> {
    resultMap?: (json: Record<string, any> | null) => Data | null;
    onLoadBegin?: () => void;
    onLoadEnd?: (isOk: boolean) => void;
    fallback?: (e: Error) => void;
}

const EMPTY_RESPONSE = null;

/**
 * Resolves the handler function with the provided payload.
 *
 * @async
 * @template Data - The expected data type of the resolved value.
 * @template Payload - The payload type to pass to the handler function.
 *
 * @param handler - The handler function to resolve. Can also be any other type that will be returned as-is.
 * @param payload - The payload to pass to the handler function.
 *
 * @returns - The resolved data from the handler function or null if the handler was not a function.
 */
const resolveHandler = async <Data = IAnything, Payload = IAnything>(handler: OneHandler<Data, Payload>, payload: Payload): Promise<Data | null> => {
    if (typeof handler === 'function') {
        const result = (handler as Function)(payload);
        return result instanceof Promise ? (await result) : result;
    } else {
        return handler;
    }
};

/**
 * Creates a static handler that wraps around an existing handler function.
 *
 * @template Data - The data type expected to be returned by the handler.
 * @template Payload - The payload type expected to be passed to the handler.
 * @param handler - The existing handler function.
 * @param options - The options for the static handler.
 * @param options.resultMap - The function to modify the returned data from the handler.
 * @param options.onLoadBegin - The function to be called when the handler starts loading.
 * @param options.onLoadEnd - The function to be called when the handler finishes loading.
 * @param options.fallback - The fallback function to be executed if an error occurs in the handler.
 * @returns - The static handler function.
 */
export const useStaticHandler = <Data extends IAnything = IAnything, Payload = IAnything>(handler: OneHandler<Data, Payload>, {
    resultMap = (data) => data as Data,
    onLoadBegin,
    onLoadEnd,
    fallback,
}: IStaticHandlerParams<Data> = {}): OneHandler<Data, Payload> => {
    /**
     * Represents a result handler function.
     * @template Data - The type of data returned by the handler.
     * @param payload - The payload to be passed to the handler.
     * @returns - A promise that resolves to a result object.
     */
    const resultHandler: OneHandler<Data> = useMemo(() => async (payload: Payload) => {
        onLoadBegin && onLoadBegin();
        let isOk = true;
        try {
            const data = await resolveHandler<Data>(handler, payload);
            return resultMap((data || {}) as Record<string, any>);
        } catch (e) {
            isOk = false;
            if (fallback) {
                fallback(e as Error);
                return EMPTY_RESPONSE;
            } else {
                throw e;
            }
        } finally {
            onLoadEnd && onLoadEnd(isOk);
        }
    }, []);
    return resultHandler;
};

export default useStaticHandler;
