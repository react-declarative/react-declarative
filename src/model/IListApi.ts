import { IListState } from "./IListProps";

import IAnything from "./IAnything";
import IRowData from "./IRowData";

/**
 * Represents an API for manipulating and retrieving data from a list.
 *
 * @template FilterData - The data type for the filter.
 * @template RowData - The data type for each row in the list.
 */
export interface IListApi<FilterData extends {} = IAnything, RowData extends IRowData = IAnything> {
    /**
     * Reloads the data.
     *
     * @param [keepPagination] - Indicates whether to keep the current pagination state.
     *
     * @returns A promise that resolves when the data has been reloaded.
     */
    reload: (keepPagination?: boolean) => Promise<void>;
    /**
     * Function to trigger a re-render of the component or element.
     *
     * @function rerender
     * @returns Returns nothing.
     */
    rerender: () => void;
    /**
     * Sets the limit value for a given variable.
     *
     * @param limit - The limit value to be set.
     * @returns
     */
    setLimit: (limit: number) => void;
    /**
     * Sets the current page number of the application.
     *
     * @param page - The page number to set.
     * @returns
     */
    setPage: (page: number) => void;
    /**
     * Sets the rows for the data table.
     *
     * @param rows - An array of row data to set.
     * @returns
     */
    setRows: (rows: RowData[]) => void;
    /**
     * Sets the filter data for filtering data.
     *
     * @param filterData - The filter data object.
     * @returns
     */
    setFilterData: (filterData: FilterData) => void;
    /**
     * Retrieves the state of the list.
     *
     * @returns The state of the list.
     */
    getState: () => IListState<FilterData, RowData>;
}

export default IListApi;
