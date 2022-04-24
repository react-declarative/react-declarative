import { useMemo, useEffect } from 'react';

import { 
    ListHandler,
    ListHandlerResult,
    ListHandlerSortModel,
    ListHandlerPagination,
} from "../../../model/IListProps";

import abortManager from '../../../helpers/abortManager';

import IAnything from "../../../model/IAnything";
import IRowData from "../../../model/IRowData";

export interface IApiPaginatorParams<FilterData = IAnything, RowData extends IRowData = IAnything> {
    origin?: string;
    filterHandler?: (url: URL, filterData: FilterData) => URL;
    sortHandler?: (url: URL, sort: ListHandlerSortModel<RowData>) => URL;
    paginationHandler?: (url: URL, pagination: ListHandlerPagination) => URL;
    onFetchBegin?: () => void;
    onFetchEnd?: () => void;
    withAbortSignal?: boolean;
    withPagination?: boolean;
    withFilters?: boolean;
    withSort?: boolean;
    fetchParams?: RequestInit;
    abortSignal?: AbortSignal;
    resultMap?: (json: Record<string, any>) => ListHandlerResult<RowData>;
}

const EMPTY_RESPONSE = {
    rows: [],
    total: null,
};

export const useApiPaginator = <FilterData = IAnything, RowData extends IRowData = IAnything>(path: string, {
    origin = window.location.origin,
    abortSignal: signal = abortManager.signal,
    fetchParams,
    onFetchBegin,
    onFetchEnd,
    resultMap = (json) => {
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
    withSort = true,
}: IApiPaginatorParams<FilterData, RowData> = {}): ListHandler<FilterData, RowData> => {
    const handler: ListHandler<FilterData, RowData> = useMemo(() => async (filterData, pagination, sort) => {
        let url = new URL(path, origin);
        if (withPagination) {
            url = paginationHandler(new URL(url), pagination);
        }
        if (withSort) {
            url = sortHandler(new URL(url), sort);
        }
        if (withFilters) {
            url = filterHandler(new URL(url), filterData);
        }
        onFetchBegin && onFetchBegin();
        try {
            const data = await fetch(url.toString(), { signal, ...fetchParams });
            const json = await data.json();
            return resultMap(json)
        } catch (e) {
            if (e instanceof DOMException && e.name == "AbortError") {
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
