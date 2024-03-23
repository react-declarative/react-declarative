import { useMemo } from 'react';

import { ListHandler } from '../../../model/IListProps';
import IAnything from '../../../model/IAnything';
import IRowData from '../../../model/IRowData';

import singleshot from '../../../utils/hof/singleshot';

import useArrayPaginator, { IArrayPaginatorParams } from "./useArrayPaginator"

/**
 * The `IResult` interface represents the result of a query or operation.
 * It provides methods for handling the result and clearing it.
 *
 * @template FilterData - The type for the filter data used in the result.
 * @template RowData - The type for the row data stored in the result.
 */
interface IResult<FilterData extends {} = IAnything, RowData extends IRowData = IAnything> {
    handler: ListHandler<FilterData, RowData>;
    clear: () => void;
}

/**
 * Creates a cached paginator for list data.
 *
 * @template FilterData - The type of the filter data.
 * @template RowData - The type of the row data.
 *
 * @param handler - The list handler function or object.
 * @param params - The parameters for the paginator.
 *
 * @returns - The result containing the paginator handler and clear function.
 */
export const useCachedPaginator = <FilterData extends {} = IAnything, RowData extends IRowData = IAnything> (
    handler: ListHandler<FilterData, RowData>,
    params: IArrayPaginatorParams<FilterData, RowData>
): IResult<FilterData, RowData> => {
    /**
     * Memoized function for handling rows.
     *
     * @returns {Function} - The memoized function.
     */
    const rowsHandler = useMemo(() => singleshot((...args: any[]) => {
        if (typeof handler === 'function') {
            return (handler as Function)(...args);
        } else {
            return handler;
        }
    }), []);
    return {
        handler: useArrayPaginator<FilterData, RowData>(rowsHandler, params),
        clear: rowsHandler.clear,
    };
};

export default useCachedPaginator;
