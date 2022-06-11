import { useMemo, useEffect } from 'react';

import { 
    OneHandler,
} from "../../../model/IOneProps";

import abortManager from '../../../helpers/abortManager';

import IAnything from "../../../model/IAnything";

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
}

const EMPTY_RESPONSE = {};

export const useApiHandler = <Data extends IAnything = IAnything>(path: string, {
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
    const handler: OneHandler<Data> = useMemo(() => async () => {
        let url = new URL(path, origin);
        url = requestMap(new URL(url));
        onLoadBegin && onLoadBegin();
        let isOk = true;
        try {
            const data = await fetch(url.toString(), { signal, ...(fetchParams && fetchParams()) });
            const json = await data.json();
            return responseMap(json);
        } catch (e) {
            isOk = false;
            if (e instanceof DOMException && e.name == "AbortError") {
                return { ...EMPTY_RESPONSE } as Data;
            } else if (fallback) {
                fallback(e as Error);
                return { ...EMPTY_RESPONSE } as Data;
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
    return handler;
};

export default useApiHandler;
