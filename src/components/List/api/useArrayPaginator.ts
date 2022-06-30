import { useMemo, useEffect } from 'react';

import { 
    ListHandler,
    ListHandlerChips,
    ListHandlerSortModel,
    ListHandlerPagination,
} from "../../../model/IListProps";

import IAnything from "../../../model/IAnything";
import IRowData from "../../../model/IRowData";

import queued from '../../../utils/hof/queued';

const EMPTY_RESPONSE = {
    rows: [],
    total: null,
};

export interface IArrayPaginatorParams<FilterData = IAnything, RowData extends IRowData = IAnything> {
    filterHandler?: (rows: RowData[], filterData: FilterData) => RowData[];
    chipsHandler?: (rows: RowData[], chips: ListHandlerChips<RowData>) => RowData[];
    sortHandler?: (rows: RowData[], sort: ListHandlerSortModel<RowData>) => RowData[];
    paginationHandler?: (rows: RowData[], pagination: ListHandlerPagination) => RowData[];
    compareFn?: (a: RowData[keyof RowData], b: RowData[keyof RowData]) => number;
    withPagination?: boolean;
    withFilters?: boolean;
    withChips?: boolean;
    withSort?: boolean;
    withTotal?: boolean;
    keepClean?: boolean;
    fallback?: (e: Error) => void;
    onLoadStart?: () => void;
    onLoadEnd?: (isOk: boolean) => void;
}

export const useArrayPaginator = <FilterData = IAnything, RowData extends IRowData = IAnything>(rowsHandler: ListHandler<FilterData, RowData>, {
    compareFn = (a, b) => {
        if (typeof a === 'number' && typeof b === 'number') {
            return a - b;
        } else if (typeof a === 'boolean' && typeof b === 'boolean') {
            return  (a ? 1 : 0) - (b ? 1 : 0);
        } else if (typeof a === 'string' && typeof b === 'string') {
            return a.localeCompare(b);
        } else {
            return 0;
        }
    },
    filterHandler = (rows, filterData) => {
        Object.entries(filterData).forEach(([key, value]) => {
            if (value) {
                const templateValue = String(value).toLocaleLowerCase();
                rows = rows.filter((row) => {
                    const rowValue = String(row[key as keyof RowData]).toLowerCase();
                    return rowValue.includes(templateValue);
                });
            }
        });
        return rows;
    },
    chipsHandler = (rows, chips) => {
        if (!Object.values(chips).reduce((acm, cur) => acm || cur, false)) {
            return rows;
        }
        const tmp: RowData[][] = [];
        Object.entries(chips).forEach(([chip, enabled]) => {
            if (enabled) {
                tmp.push(rows.filter((row) => row[chip]));
            }
        });
        return tmp.flat();
    },
    sortHandler = (rows, sort) => {
        sort.forEach(({
            field,
            sort,
        }) => {
            rows = rows.sort((a, b) => {
                if (sort === 'asc') {
                    return compareFn(a[field], b[field]);
                } else {
                    return compareFn(b[field], a[field]);
                }
            });
        });
        return rows;
    },
    paginationHandler = (rows, {
        limit,
        offset,
    }) => {
        return rows.slice(offset, limit + offset);
    },
    withPagination = true,
    withFilters = true,
    withChips = true,
    withSort = true,
    withTotal = true,
    keepClean = false,
    fallback,
    onLoadStart,
    onLoadEnd,
}: IArrayPaginatorParams<FilterData, RowData> = {}): ListHandler<FilterData, RowData> => {

    const queuedResolve = useMemo(() => queued(async (
        filterData: FilterData,
        pagination: ListHandlerPagination,
        sort: ListHandlerSortModel,
        chips: ListHandlerChips,
    ) => {
        if (typeof rowsHandler === 'function') {
            return await rowsHandler(filterData, pagination, sort, chips);
        } else {
            return rowsHandler;
        }
    }), []);

    const handler: ListHandler<FilterData, RowData> = useMemo(() => async (filterData, pagination, sort, chips) => {
        let isOk = true;
        try {
            onLoadStart && onLoadStart();
            const data = await queuedResolve(filterData, pagination, sort, chips);
            let rows = Array.isArray(data) ? data : data.rows;
            if (withFilters && !keepClean) {
                rows = filterHandler(rows.slice(0), filterData);
            }
            if (withChips && !keepClean) {
                rows = chipsHandler(rows.slice(0), chips);
            }
            if (withSort && !keepClean) {
                rows = sortHandler(rows.slice(0), sort);
            }
            if (withPagination && !keepClean) {
                rows = paginationHandler(rows.slice(0), pagination);
            }
            const total = Array.isArray(data) ? data.length : data.total;
            return {
                rows,
                total: withTotal ? total : null,
            };
        } catch (e) {
            queuedResolve.clear();
            isOk = false;
            if (fallback) {
                fallback(e as Error);
                return { ...EMPTY_RESPONSE };
            } else {
                throw e;
            }
        } finally {
            onLoadEnd && onLoadEnd(isOk);
        }
    }, []);

    useEffect(() => () => queuedResolve.clear(), []);

    return handler;
};

export default useArrayPaginator;
