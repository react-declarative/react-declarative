import { useMemo, useEffect } from 'react';

import { 
    ListHandler,
    ListHandlerChips,
    ListHandlerSortModel,
    ListHandlerPagination,
} from "../../../model/IListProps";

import IAnything from "../../../model/IAnything";
import IRowData from "../../../model/IRowData";

import { dateStamp, timeStamp } from '../../../utils/datetime';
import { DATE_EXPR, TIME_EXPR } from '../../../utils/datetime';

import { IState as ILastPaginationState } from './useLastPagination';

import filterString from '../../../utils/filterArray';
import queued from '../../../utils/hof/queued';

const FILTER_CHARS = [',', ';', '-', '@'];

const EMPTY_RESPONSE = {
    rows: [],
    total: null,
};

const SEARCH_ENTRIES = [
    "name",
    "label",
    "title",
    "description",
];

export interface IArrayPaginatorParams<FilterData extends {} = IAnything, RowData extends IRowData = IAnything> {
    filterHandler?: (rows: RowData[], filterData: FilterData) => RowData[];
    chipsHandler?: (rows: RowData[], chips: ListHandlerChips<RowData>) => RowData[];
    sortHandler?: (rows: RowData[], sort: ListHandlerSortModel<RowData>) => RowData[];
    paginationHandler?: (rows: RowData[], pagination: ListHandlerPagination) => RowData[];
    responseMap?: (json: RowData[]) => (Record<string, any>[] | Promise<Record<string, any>[]>);
    searchHandler?: (rows: RowData[], search: string) => RowData[];
    compareFn?: (a: RowData[keyof RowData], b: RowData[keyof RowData], field: keyof RowData) => number;
    withPagination?: boolean;
    withFilters?: boolean;
    withChips?: boolean;
    withSort?: boolean;
    withTotal?: boolean;
    withSearch?: boolean;
    searchEntries?: string[];
    searchFilterChars?: string[];
    fallback?: (e: Error) => void;
    onData?: (rows: RowData[], state: ILastPaginationState<FilterData, RowData>) => void;
    onLoadStart?: () => void;
    onLoadEnd?: (isOk: boolean) => void;
}

export const useArrayPaginator = <FilterData extends {} = IAnything, RowData extends IRowData = IAnything>(rowsHandler: ListHandler<FilterData, RowData>, {
    searchEntries = SEARCH_ENTRIES,
    searchFilterChars = FILTER_CHARS,
    responseMap = (rows) => rows as RowData[],
    compareFn = (a, b) => {
        if (typeof a === 'number' && typeof b === 'number') {
            return a - b;
        } else if (typeof a === 'boolean' && typeof b === 'boolean') {
            return  (a ? 1 : 0) - (b ? 1 : 0);
        } else if (typeof a === 'string' && typeof b === 'string') {
            if (a.match(DATE_EXPR) && b.match(DATE_EXPR)) {
                return dateStamp(a) - dateStamp(b);
            }
            if (a.match(TIME_EXPR) && b.match(TIME_EXPR)) {
                return timeStamp(a) - timeStamp(b);
            }
            return a.localeCompare(b);
        } else {
            return 0;
        }
    },
    filterHandler = (rows, filterData) => {
        Object.entries(filterData).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach((value) => {
                    const templateValue = String(value).toLocaleLowerCase();
                    rows = rows.filter((row) => {
                        if (!row[key as keyof RowData]) {
                            return false;
                        }
                        const rowValue = JSON.stringify(row[key as keyof RowData] || '').toLowerCase();
                        return rowValue.includes(templateValue);
                    });
                });
            } else if (value) {
                const templateValue = String(value).toLocaleLowerCase();
                rows = rows.filter((row) => {
                    if (!row[key as keyof RowData]) {
                        return false;
                    }
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
                    return compareFn(a[field], b[field], field);
                } else {
                    return compareFn(b[field], a[field], field);
                }
            });
        });
        return rows;
    },
    searchHandler = (rows, search) => {
        if (rows.length && search) {
            const hasEntries = searchEntries.every((entry) => rows[0][entry] !== undefined);
            const searchQuery = search.toLowerCase().split(' ');
            if (hasEntries) {
                return rows.filter((row) => {
                    let isOk = false;
                    searchEntries.forEach((searchEntry) => {
                        if (row[searchEntry]) {
                            let rowValue: any = String(row[searchEntry]).toLowerCase()
                            rowValue = filterString(rowValue, ...searchFilterChars);
                            if (rowValue) {
                                isOk = isOk || searchQuery.some((value: string) => rowValue.includes(value));
                            }
                        }
                    });
                    return isOk;
                });
            } else {
                console.warn('react-declatative useArrayPaginator searchHandler missing field detected');
                return rows;
            }
        } else {
            return rows;
        }
    },
    paginationHandler = (rows, {
        limit,
        offset,
    }) => {
        if (rows.length > limit) {
            return rows.slice(offset, limit + offset);
        } else {
            return rows;
        }
    },
    withPagination = true,
    withFilters = true,
    withChips = true,
    withSort = true,
    withTotal = true,
    withSearch = true,
    fallback,
    onLoadStart,
    onLoadEnd,
    onData,
}: IArrayPaginatorParams<FilterData, RowData> = {}): ListHandler<FilterData, RowData> => {

    const queuedResolve = useMemo(() => queued(async (
        filterData: FilterData,
        pagination: ListHandlerPagination,
        sort: ListHandlerSortModel,
        chips: ListHandlerChips,
        search: string,
    ) => {
        if (typeof rowsHandler === 'function') {
            return await rowsHandler(filterData, pagination, sort, chips, search);
        } else {
            return rowsHandler;
        }
    }), []);

    const handler: ListHandler<FilterData, RowData> = useMemo(() => async (filterData, pagination, sort, chips, search) => {
        let isOk = true;
        try {
            onLoadStart && onLoadStart();
            const data = await queuedResolve(filterData, pagination, sort, chips, search);
            const keepClean = !Array.isArray(data);
            let rows = keepClean ? data.rows : data;
            rows = [...rows].map((row) => ({...row}));
            rows = await responseMap(rows) as RowData[];
            onData && onData(rows, {
                filterData,
                pagination,
                sort,
                chipData: chips,
                search
            });
            if (withFilters && !keepClean) {
                rows = filterHandler(rows.slice(0), filterData);
            }
            if (withChips && !keepClean) {
                rows = chipsHandler(rows.slice(0), chips);
            }
            if (withSort && !keepClean) {
                rows = sortHandler(rows.slice(0), sort);
            }
            if (withSearch && !keepClean) {
                rows = searchHandler(rows.slice(0), search);
            }
            const totalLength = rows.length;
            if (withPagination && !keepClean) {
                rows = paginationHandler(rows.slice(0), pagination);
            }
            const total = keepClean ? (data.total || null) : totalLength;
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
