import { useMemo, useEffect } from 'react';

import { 
    OneHandler,
} from "../../../model/IOneProps";

import abortManager from '../../../helpers/abortManager';

import IAnything from "../../../model/IAnything";

import { FetchError } from '../../../utils/fetchApi';
import queued from '../../../utils/hof/queued';
import { CANCELED_SYMBOL } from '../../../utils/hof/cancelable';

export interface IApiHandlerParams<Data extends IAnything = IAnything> {
    origin?: string;
    requestMap?: (url: URL) => URL;
    responseMap?: (json: Data) => (Record<string, any> | Promise<Record<string, any>>);
    onLoadBegin?: () => void;
    onLoadEnd?: (isOk: boolean) => void;
    withAbortSignal?: boolean;
    fetchParams?: () => RequestInit;
    fallback?: (e: Error) => void;
    abortSignal?: AbortSignal;
    fetch?: typeof window.fetch,
}

const EMPTY_RESPONSE = null;

/**
 * This function is a generic API handler that fetches data from a specified path using the Fetch API.
 * It provides options for customizing the fetch request, handling loading state, aborting the request, and error handling.
 *
 * @template Data - The type of the data returned from the API
 * @param {string} path - The relative or absolute path to fetch from
 * @param {Object} options - An object containing optional configuration options for the API handler
 * @param {Function} options.fetch - The fetch function to use (default: window.fetch)
 * @param {string} options.origin - The origin to use when constructing the URL (default: window.location.origin)
 * @param {AbortSignal} options.abortSignal - The AbortSignal object to use for aborting the request (default: abortManager.signal)
 * @param {Function} options.requestMap - A function to transform the URL before making the request (default: (url) => url)
 * @param {Function} options.responseMap - A function to transform the JSON response from the API (default: (json) => json as never)
 * @param {Function} options.onLoadBegin - An optional callback function to execute when the request begins loading
 * @param {Function} options.onLoadEnd - An optional callback function to execute when the request finishes loading
 * @param {boolean} options.withAbortSignal - Whether to use the abort signal to cancel the request (default: true)
 * @param {Function} options.fetchParams - An optional function to retrieve additional fetch parameters to be passed to fetch
 * @param {Function} options.fallback - An optional function to handle errors and provide fallback behavior
 * @returns {Function} - The API handler function that can be invoked to make the request and retrieve the data
 */
export const useApiHandler = <Data extends IAnything = IAnything>(path: string, {
    fetch = window.fetch,
    origin = window.location.origin,
    abortSignal: signal = abortManager.signal,
    requestMap = (url) => url,
    responseMap = (json) => json as never,
    onLoadBegin,
    onLoadEnd,
    withAbortSignal = true,
    fetchParams,
    fallback,
}: IApiHandlerParams<Data> = {}): OneHandler<Data> => {

    const queuedFetch = useMemo(() => queued(fetch), []);

    const handler: OneHandler<Data> = useMemo(() => async () => {
        let url = new URL(path, origin);
        url = requestMap(new URL(url));
        onLoadBegin && onLoadBegin();
        let isOk = true;
        try {
            const data = await queuedFetch(url.toString(), { signal, ...(fetchParams && fetchParams()) });
            if (data === CANCELED_SYMBOL) {
                return null;
            }
            const json = await data.json();
            return responseMap(json) as Data;
        } catch (e) {
            queuedFetch.clear();
            isOk = false;
            if (e instanceof FetchError) {
                e = e.originalError;
            }
            if (e instanceof DOMException && e.name == "AbortError") {
                return EMPTY_RESPONSE;
            } else if (fallback) {
                fallback(e as Error);
                return EMPTY_RESPONSE;
            } else {
                throw e;
            }
        } finally {
            onLoadEnd && onLoadEnd(isOk);
        }
    }, []);

    useEffect(() => () => {
        if (withAbortSignal) {
            abortManager.abort();
        }
    }, []);

    useEffect(() => () => {
        queuedFetch.clear();
    }, []);

    return handler;
};

export default useApiHandler;
