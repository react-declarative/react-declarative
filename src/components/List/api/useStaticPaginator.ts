import { useMemo } from 'react';

import { 
    ListHandler,
    ListHandlerChips,
    ListHandlerSortModel,
    ListHandlerPagination,
} from "../../../model/IListProps";

import IAnything from "../../../model/IAnything";
import IRowData from "../../../model/IRowData";

export interface IStaticPaginatorParams<FilterData = IAnything, RowData extends IRowData = IAnything> {
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
}

export const useStaticPaginator = <FilterData = IAnything, RowData extends IRowData = IAnything>(rows: RowData[], {
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
        if (!Object.values(chips).reduce((acm, cur) => acm || cur)) {
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
}: IStaticPaginatorParams<FilterData, RowData> = {}): ListHandler<FilterData, RowData> => {
    const handler: ListHandler<FilterData, RowData> = useMemo(() => (filterData, pagination, sort, chips) => {
        let handledRows = rows.slice(0);
        if (withFilters) {
            handledRows = filterHandler(handledRows.slice(0), filterData);
        }
        if (withChips) {
            handledRows = chipsHandler(handledRows.slice(0), chips);
        }
        if (withSort) {
            handledRows = sortHandler(handledRows.slice(0), sort);
        }
        if (withPagination) {
            handledRows = paginationHandler(handledRows.slice(0), pagination);
        }
        return {
            rows: handledRows,
            total: withTotal ? rows.length : null,
        };
    }, []);
    return handler;
};

export default useStaticPaginator;
