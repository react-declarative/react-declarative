import { useMemo, useEffect } from 'react';

import { 
    OneHandler,
} from "../../../model/IOneProps";

import abortManager from '../../../helpers/abortManager';

import IAnything from "../../../model/IAnything";

import { FetchError } from '../../../utils/fetchApi';
import queued from '../../../utils/hof/queued';

export interface IApiHandlerParams<Data extends IAnything = IAnything> {
    origin?: string;
    requestMap?: (url: URL) => URL;
    responseMap?: (json: Record<string, any>) => Data;
    onLoadBegin?: () => void;
    onLoadEnd?: (isOk: boolean) => void;
    withAbortSignal?: boolean;
    fetchParams?: () => RequestInit;
    fallback?: (e: Error) => void;
    abortSignal?: AbortSignal;
    fetch?: typeof window.fetch,
}

const EMPTY_RESPONSE = null;

export const useApiHandler = <Data extends IAnything = IAnything>(path: string, {
    fetch = window.fetch,
    origin = window.location.origin,
    abortSignal: signal = abortManager.signal,
    requestMap = (url) => url,
    responseMap = (json) => json as Data,
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
            const json = await data.json();
            return responseMap(json);
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
