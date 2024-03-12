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

import removeEmptyFiltersDefault from '../helpers/removeEmptyFilters';

import { CANCELED_SYMBOL } from '../../../utils/hof/cancelable';
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
    compareFn?: (a: RowData, b: RowData, field: keyof RowData) => number;
    removeEmptyFilters?: (data: FilterData) => Partial<FilterData>;
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

/**
 * A utility function for pagination and filtering an array of data rows.
 *
 * @template FilterData - The type of the filter data object.
 * @template RowData - The type of the row data object.
 *
 * @param rowsHandler - The function that retrieves the data rows.
 * @param options - The optional configuration options.
 * @param options.searchEntries - The array of property names to search in when using the search feature. Defaults to SEARCH_ENTRIES.
 * @param options.searchFilterChars - The array of characters to filter in the search feature. Defaults to FILTER_CHARS.
 * @param options.responseMap - The function to map the rows data to the desired output shape. Defaults to mapping to RowData.
 * @param options.removeEmptyFilters - The flag to remove empty filters from the filter data object. Defaults to removeEmptyFiltersDefault.
 * @param options.compareFn - The function to compare two rows based on a field value. Defaults to a default comparison logic.
 * @param options.filterHandler - The function to filter the rows based on the filter data. Defaults to a default filter
 * logic.
 * @param options.chipsHandler - The function to filter the rows based on the chip data. Defaults to a default chip filter logic
 *.
 * @param options.sortHandler - The function to sort the rows based on the sort model. Defaults
 * to a default sort logic.
 * @param options.searchHandler - The function to search for rows based on a search string. Defaults to a default search logic
 *.
 * @param options.paginationHandler - The function to paginate the rows based on the pagination
 * model. Defaults to a default pagination logic.
 * @param options.withPagination - The flag to enable pagination. Defaults to true.
 * @param options.withFilters - The flag to enable filtering. Defaults to true.
 * @param options.withChips - The flag to enable chip filtering. Defaults to true.
 * @param options.withSort - The flag to enable sorting. Defaults to true.
 * @param options.withTotal - The flag to enable total count. Defaults to true.
 * @param options.withSearch - The flag to enable searching. Defaults to true.
 * @param options.fallback - The function to handle errors. Defaults to null.
 * @param options.onLoadStart - The function to call when the data loading starts. Defaults to null.
 * @param options.onLoadEnd - The function to call when the data loading ends. Defaults to null.
 * @param options.onData - The function to call when the data is received. Defaults to null.
 *
 * @returns - The list handler function.
 */
export const useArrayPaginator = <FilterData extends {} = IAnything, RowData extends IRowData = IAnything>(rowsHandler: ListHandler<FilterData, RowData>, {
    searchEntries = SEARCH_ENTRIES,
    searchFilterChars = FILTER_CHARS,
    responseMap = (rows) => rows as RowData[],
    removeEmptyFilters = removeEmptyFiltersDefault,
    compareFn = (row_a, row_b, field) => {
        const a = row_a[field];
        const b = row_b[field];
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
            return String(a || "").localeCompare(String(b || ""));
        }
    },
    filterHandler = (rows, filterData) => {
        Object.entries(filterData).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                rows = rows.filter((row) => {
                    const rowValue = row[key as keyof RowData] as unknown as any[];
                    if (!Array.isArray(rowValue)) {
                        return value.includes(rowValue);
                    }
                    return value.every((v) => rowValue.includes(v));
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
                    return compareFn(a, b, field);
                } else {
                    return compareFn(b, a, field);
                }
            });
        });
        return rows;
    },
    searchHandler = (rows, search) => {
        if (rows.length && search) {
            const hasEntries = searchEntries.every((entry) => rows[0][entry] !== undefined);
            const searchQuery = filterString(search.toLowerCase(), ...searchFilterChars).split(' ');
            if (hasEntries) {
                return rows.filter((row) => {
                    let isOk = true;
                    searchQuery.forEach((search) => {
                        isOk = isOk && searchEntries.some((searchEntry: string) => {
                            let rowValue: any = row[searchEntry] ? String(row[searchEntry]).toLowerCase() : '';
                            rowValue = filterString(rowValue, ...searchFilterChars);
                            return rowValue ? rowValue.includes(search) : false;
                        });
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
        payload: IAnything,
    ) => {
        if (typeof rowsHandler === 'function') {
            return await rowsHandler(filterData, pagination, sort, chips, search, payload);
        } else {
            return rowsHandler;
        }
    }), []);

    const handler: ListHandler<FilterData, RowData> = useMemo(() => async (filterData, pagination, sort, chips, search, payload) => {
        filterData = removeEmptyFilters(filterData) as FilterData;
        let isOk = true;
        try {
            onLoadStart && onLoadStart();
            const data = await queuedResolve(filterData, pagination, sort, chips, search, payload);
            if (data === CANCELED_SYMBOL) {
                return {
                    rows: [],
                    total: null,
                };
            }
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
