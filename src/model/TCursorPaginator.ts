import IRowData, { RowId } from "./IRowData";

/**
 * Represents a type for cursor pagination.
 * @typeparam FilterData - The type of filter data.
 * @typeparam RowData - The type of row data.
 * @typeparam Payload - The type of payload.
 *
 * @param filterData - The filter data to be applied to the dataset.
 * @param lastId - The last id from which to start retrieving records.
 * @param payload - The payload containing additional parameters for filtering.
 *
 * @returns {Promise<RowData[]> | RowData[]} - A promise resolving to an array of filtered row data or an array of filtered row data.
 */
export interface TCursorPaginator<
    FilterData extends {} = any,
    RowData extends IRowData = any,
    Payload = any
> {
    (filterData: FilterData, lastId: RowId, payload: Payload): Promise<RowData[]> | RowData[];
} 

export default TCursorPaginator;
