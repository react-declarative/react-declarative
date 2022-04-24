import { useMemo } from 'react';

import { 
    ListHandler,
    ListHandlerSortModel,
    ListHandlerPagination,
} from "../../../model/IListProps";

import IAnything from "../../../model/IAnything";
import IRowData from "../../../model/IRowData";

export interface IStaticPaginatorParams<FilterData = IAnything, RowData extends IRowData = IAnything> {
    filterHandler?: (rows: RowData[], filterData: FilterData) => RowData[];
    sortHandler?: (rows: RowData[], sort: ListHandlerSortModel<RowData>) => RowData[];
    paginationHandler?: (rows: RowData[], pagination: ListHandlerPagination) => RowData[];
    withPagination?: boolean;
    withFilters?: boolean;
    withSort?: boolean;
    withTotal?: boolean;
}

export const useStaticPaginator = <FilterData = IAnything, RowData extends IRowData = IAnything>(rows: RowData[], {
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
    sortHandler = (rows, sort) => {
        sort.forEach(({
            field,
            sort,
        }) => {
            rows = rows.sort((a, b) => {
                const value1 = String(a[field as keyof RowData]);
                const value2 = String(b[field as keyof RowData]);
                return sort === 'asc' ? value1.localeCompare(value2) : value2.localeCompare(value1);
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
    withSort = true,
    withTotal = true,
}: IStaticPaginatorParams<FilterData, RowData> = {}): ListHandler<FilterData, RowData> => {
    const handler: ListHandler<FilterData, RowData> = useMemo(() => (filterData, pagination, sort) => {
        let handledRows = rows.slice(0);
        if (withFilters) {
            handledRows = filterHandler(handledRows, filterData);
        }
        if (withSort) {
            handledRows = sortHandler(handledRows, sort);
        }
        if (withPagination) {
            handledRows = paginationHandler(handledRows, pagination);
        }
        return {
            rows: handledRows,
            total: withTotal ? rows.length : null,
        };
    }, []);
    return handler;
};

export default useStaticPaginator;
