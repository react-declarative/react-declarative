import { useMemo } from 'react';

import { 
    OneHandler,
} from "../../../model/IOneProps";

import IAnything from "../../../model/IAnything";

export interface IStaticHandlerParams<Data extends IAnything = IAnything> {
    resultMap?: (json: Record<string, any> | null) => Data | null;
    onLoadBegin?: () => void;
    onLoadEnd?: (isOk: boolean) => void;
    fallback?: (e: Error) => void;
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
 * Creates a static handler that wraps around an existing handler function.
 *
 * @template Data - The data type expected to be returned by the handler.
 * @template Payload - The payload type expected to be passed to the handler.
 * @param {OneHandler<Data, Payload>} handler - The existing handler function.
 * @param {Object} options - The options for the static handler.
 * @param {Function} options.resultMap - The function to modify the returned data from the handler.
 * @param {Function} options.onLoadBegin - The function to be called when the handler starts loading.
 * @param {Function} options.onLoadEnd - The function to be called when the handler finishes loading.
 * @param {Function} options.fallback - The fallback function to be executed if an error occurs in the handler.
 * @returns {OneHandler<Data, Payload>} - The static handler function.
 */
export const useStaticHandler = <Data extends IAnything = IAnything, Payload = IAnything>(handler: OneHandler<Data, Payload>, {
    resultMap = (data) => data as Data,
    onLoadBegin,
    onLoadEnd,
    fallback,
}: IStaticHandlerParams<Data> = {}): OneHandler<Data, Payload> => {
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
