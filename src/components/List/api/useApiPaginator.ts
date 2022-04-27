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

export interface IApiPaginatorParams<FilterData = IAnything, RowData extends IRowData = IAnything> {
    origin?: string;
    requestMap?: (url: URL) => URL;
    filterHandler?: (url: URL, filterData: FilterData) => URL;
    chipsHandler?: (url: URL, chips: ListHandlerChips<RowData>) => URL;
    sortHandler?: (url: URL, sort: ListHandlerSortModel<RowData>) => URL;
    paginationHandler?: (url: URL, pagination: ListHandlerPagination) => URL;
    onFetchBegin?: () => void;
    onFetchEnd?: () => void;
    withAbortSignal?: boolean;
    withPagination?: boolean;
    withFilters?: boolean;
    withChips?: boolean;
    withSort?: boolean;
    fetchParams?: () => RequestInit;
    fallback?: (e: Error) => void;
    abortSignal?: AbortSignal;
    responseMap?: (json: Record<string, any>) => ListHandlerResult<RowData>;
}

const EMPTY_RESPONSE = {
    rows: [],
    total: null,
};

export const useApiPaginator = <FilterData = IAnything, RowData extends IRowData = IAnything>(path: string, {
    origin = window.location.origin,
    abortSignal: signal = abortManager.signal,
    fetchParams,
    fallback,
    onFetchBegin,
    onFetchEnd,
    requestMap = (url) => url,
    responseMap = (json) => {
        const { rows = [], total = null } = json;
        return {
            rows,
            total,
        };
    },
    filterHandler = (url, filterData) => {
        Object.entries(filterData).forEach(([k, v]) => {
            if (v) {
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
                url.searchParams.append('sortBy', `${field}:${sort.toUpperCase()}`)
            }
        });
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
    withChips = true,
    withSort = true,
}: IApiPaginatorParams<FilterData, RowData> = {}): ListHandler<FilterData, RowData> => {
    const handler: ListHandler<FilterData, RowData> = useMemo(() => async (filterData, pagination, sort, chips) => {
        let url = new URL(path, origin);
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
        url = requestMap(new URL(url));
        onFetchBegin && onFetchBegin();
        try {
            const data = await fetch(url.toString(), { signal, ...(fetchParams && fetchParams()) });
            const json = await data.json();
            return responseMap(json);
        } catch (e) {
            if (e instanceof DOMException && e.name == "AbortError") {
                return { ...EMPTY_RESPONSE };
            } else if (fallback) {
                fallback(e as Error);
                return { ...EMPTY_RESPONSE };
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

export default useApiPaginator;
