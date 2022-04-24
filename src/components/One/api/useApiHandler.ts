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
    onFetchBegin?: () => void;
    onFetchEnd?: () => void;
    withAbortSignal?: boolean;
    getFetchParams?: () => RequestInit;
    abortSignal?: AbortSignal;
}

const EMPTY_RESPONSE = {};

export const useApiHandler = <Data extends IAnything = IAnything>(path: string, {
    origin = window.location.origin,
    abortSignal: signal = abortManager.signal,
    requestMap = (url) => url,
    responseMap = (json) => json as Data,
    onFetchBegin,
    onFetchEnd,
    withAbortSignal = true,
    getFetchParams,
}: IApiHandlerParams<Data> = {}): OneHandler<Data> => {
    const handler: OneHandler<Data> = useMemo(() => async () => {
        let url = new URL(path, origin);
        url = requestMap(new URL(url));
        onFetchBegin && onFetchBegin();
        try {
            const data = await fetch(url.toString(), { signal, ...(getFetchParams && getFetchParams()) });
            const json = await data.json();
            return responseMap(json);
        } catch (e) {
            if (e instanceof DOMException && e.name == "AbortError") {
                return { ...EMPTY_RESPONSE } as Data;
            } else {
                throw e;
            }
        } finally {
            onFetchEnd && onFetchEnd();
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
