import { 
    ListHandler,
    ListHandlerResult,
    ListHandlerSortModel,
    ListHandlerPagination,
} from "../../../model/IListProps";

import IAnything from "../../../model/IAnything";
import IRowData from "../../../model/IRowData";

interface IApiPaginatorParams<FilterData = IAnything, RowData extends IRowData = IAnything> {
    origin?: string;
    filterHandler?: (url: URL, filterData: FilterData) => URL;
    sortHandler?: (url: URL, sort: ListHandlerSortModel<RowData>) => URL;
    paginationHandler?: (url: URL, pagination: ListHandlerPagination) => URL;
    withPagination?: boolean;
    withFilters?: boolean;
    withSort?: boolean;
    fetchParams?: RequestInit;
    resultMap?: (json: any) => ListHandlerResult<RowData>;
}

export const useApiPaginator = <FilterData = IAnything, RowData extends IRowData = IAnything>(path: string, {
    origin = window.location.origin,
    fetchParams,
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
    withPagination = true,
    withFilters = true,
    withSort = true,
}: IApiPaginatorParams<FilterData, RowData> = {}): ListHandler<FilterData, RowData> => async (filterData, pagination, sort) => {
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
    const data = await fetch(url.toString(), fetchParams);
    const json = await data.json();
    return resultMap(json);
};

export default useApiPaginator;
