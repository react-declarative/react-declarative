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
     * @param {boolean} [keepPagination] - Indicates whether to keep the current pagination state.
     *
     * @returns {Promise<void>} A promise that resolves when the data has been reloaded.
     */
    reload: (keepPagination?: boolean) => Promise<void>;
    /**
     * Function to trigger a re-render of the component or element.
     *
     * @function rerender
     * @returns {void} Returns nothing.
     */
    rerender: () => void;
    /**
     * Sets the limit value for a given variable.
     *
     * @param {number} limit - The limit value to be set.
     * @returns {void}
     */
    setLimit: (limit: number) => void;
    /**
     * Sets the current page number of the application.
     *
     * @param {number} page - The page number to set.
     * @returns {void}
     */
    setPage: (page: number) => void;
    /**
     * Sets the rows for the data table.
     *
     * @param {RowData[]} rows - An array of row data to set.
     * @returns {void}
     */
    setRows: (rows: RowData[]) => void;
    /**
     * Sets the filter data for filtering data.
     *
     * @param {FilterData} filterData - The filter data object.
     * @returns {void}
     */
    setFilterData: (filterData: FilterData) => void;
    /**
     * Retrieves the state of the list.
     *
     * @returns {IListState<FilterData, RowData>} The state of the list.
     */
    getState: () => IListState<FilterData, RowData>;
}

export default IListApi;
