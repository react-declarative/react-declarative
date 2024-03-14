import { useState } from 'react';

import { 
    ListHandler,
    ListHandlerChips,
    ListHandlerSortModel,
    ListHandlerPagination,
} from "../../../model/IListProps";

import removeEmptyFilters from '../helpers/removeEmptyFilters';

import IAnything from "../../../model/IAnything";
import IRowData from "../../../model/IRowData";

/**
 * Represents the interface for a result.
 *
 * @template FilterData The type for the filter data.
 * @template RowData The type for the row data.
 */
interface IResult<FilterData extends {} = IAnything, RowData extends IRowData = IAnything> {
    data: IState<FilterData, RowData>;
    handler: ListHandler<FilterData, RowData>;
}

/**
 * Represents the state of a component.
 * @template FilterData - The type of the filter data.
 * @template RowData - The type of the row data.
 */
export interface IState<FilterData extends {} = IAnything, RowData extends IRowData = IAnything> {
    filterData: FilterData;
    pagination: ListHandlerPagination;
    sort: ListHandlerSortModel<RowData>;
    chipData: ListHandlerChips<RowData>;
    search: string;
}

/**
 * Custom hook for managing pagination state and handling pagination logic.
 *
 * @template FilterData - The type of filter data.
 * @template RowData - The type of row data.
 *
 * @param upperHandler - The handler function responsible for fetching data.
 *
 * @returns - An object containing the handler function and the state data.
 */
export const useLastPagination = <FilterData extends {} = IAnything, RowData extends IRowData = IAnything>(upperHandler: ListHandler<FilterData, RowData>): IResult => {
    const [data, setData] = useState<IState<FilterData, RowData>>({
        filterData: {} as FilterData,
        chipData: {} as ListHandlerChips<RowData>,
        sort: [],
        pagination: {
            offset: 0,
            limit: 0,
        },
        search: "",
    });
    const handler: ListHandler<FilterData, RowData> = (filterData, pagination, sort, chipData, search, payload) => {
        filterData = removeEmptyFilters(filterData);
        setData({ filterData, pagination, sort, chipData, search });
        return typeof upperHandler === 'function' ? upperHandler(filterData, pagination, sort, chipData, search, payload): upperHandler;
    };
    return {
        handler,
        data,
    };
};

export default useLastPagination;
