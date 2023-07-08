import { useMemo, useEffect } from 'react';

import { 
    ListHandler,
    ListHandlerChips,
    ListHandlerResult,
    ListHandlerSortModel,
    ListHandlerPagination,
} from "../../../model/IListProps";

import abortManager from '../../../helpers/abortManager';

import IAnything from "../../../model/IAnything";
import IRowData from "../../../model/IRowData";

import { FetchError } from '../../../utils/fetchApi';
import queued from '../../../utils/hof/queued';

export interface IApiPaginatorParams<FilterData extends {} = IAnything, RowData extends IRowData = IAnything> {
    origin?: string;
    fetch?: typeof window.fetch;
    requestMap?: (url: URL) => URL;
    filterHandler?: (url: URL, filterData: FilterData) => URL;
    chipsHandler?: (url: URL, chips: ListHandlerChips<RowData>) => URL;
    sortHandler?: (url: URL, sort: ListHandlerSortModel<RowData>) => URL;
    searchHandler?: (url: URL, search: string) => URL;
    paginationHandler?: (url: URL, pagination: ListHandlerPagination) => URL;
    onLoadBegin?: () => void;
    onLoadEnd?: (isOk: boolean) => void;
    withAbortSignal?: boolean;
    withPagination?: boolean;
    withFilters?: boolean;
    withChips?: boolean;
    withSearch?: boolean;
    withSort?: boolean;
    fetchParams?: () => RequestInit;
    fallback?: (e: Error) => void;
    abortSignal?: AbortSignal;
    responseMap?: <T extends IRowData>(json: RowData[]) => (ListHandlerResult<T> | Promise<ListHandlerResult<T>>);
}

const EMPTY_RESPONSE = {
    rows: [],
    total: null,
};

export const useApiPaginator = <FilterData extends {} = IAnything, RowData extends IRowData = IAnything>(path: string, {
    fetch = window.fetch,
    origin = window.location.origin,
    abortSignal: signal = abortManager.signal,
    fetchParams,
    fallback,
    onLoadBegin,
    onLoadEnd,
    requestMap = (url) => url,
    responseMap = (data) => data as  never,
    filterHandler = (url, filterData) => {
        Object.entries(filterData).forEach(([k, v]) => {
            if (Array.isArray(v)) {
                v.forEach((v) => {
                    url.searchParams.append(`filter.${k}`, `$lte:${v}`);
                });
            } else if (v) {
                url.searchParams.append(`filter.${k}`, `$lte:${v}`);
            }
        });
        return url;
    },
    chipsHandler = (url, chips) => {
        Object.entries(chips).forEach(([chip, enabled]) => {
            if (enabled) {
                url.searchParams.append(`filter.${chip}`, `$eq:1`);
            }
        });
        return url;
    },
    sortHandler = (url, sort) => {
        sort.forEach(({
            field,
            sort,
        }) => {
            if (sort) {
                url.searchParams.append('sortBy', `${String(field)}:${sort.toUpperCase()}`)
            }
        });
        return url;
    },
    searchHandler = (url, search) => {
        url.searchParams.set('search', search);
        return url;
    },
    paginationHandler = (url, {
        limit,
        offset,
    }) => {
        url.searchParams.set('limit', limit.toString());
        url.searchParams.set('page', (offset / limit).toString());
        return url;
    },
    withAbortSignal = true,
    withPagination = true,
    withFilters = true,
    withSearch = true,
    withChips = true,
    withSort = true,
}: IApiPaginatorParams<FilterData, RowData> = {}): ListHandler<FilterData, RowData> => {

    const queuedFetch = useMemo(() => queued(fetch), []);

    const handler: ListHandler<FilterData, RowData> = useMemo(() => async (filterData, pagination, sort, chips, search) => {
        let url = new URL(path, origin);
        let isOk = true;
        if (withPagination) {
            url = paginationHandler(new URL(url), pagination);
        }
        if (withFilters) {
            url = filterHandler(new URL(url), filterData);
        }
        if (withChips) {
            url = chipsHandler(new URL(url), chips);
        }
        if (withSort) {
            url = sortHandler(new URL(url), sort);
        }
        if (withSearch) {
            url = searchHandler(new URL(url), search);
        }
        url = requestMap(new URL(url));
        onLoadBegin && onLoadBegin();
        try {
            const data = await queuedFetch(url.toString(), { signal, ...(fetchParams && fetchParams()) });
            const json = await data.json();
            return await responseMap(json);
        } catch (e) {
            queuedFetch.clear();
            isOk = false;
            if (e instanceof FetchError) {
                e = e.originalError;
            }
            if (e instanceof DOMException && e.name == "AbortError") {
                return { ...EMPTY_RESPONSE };
            } else if (fallback) {
                fallback(e as Error);
                return { ...EMPTY_RESPONSE };
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
        queuedFetch.clear()
    }, []);

    return handler;
};

export default useApiPaginator;
