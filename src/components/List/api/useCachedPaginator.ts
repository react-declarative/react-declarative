import { useMemo } from 'react';

import { ListHandler } from '../../../model/IListProps';
import IAnything from '../../../model/IAnything';
import IRowData from '../../../model/IRowData';

import singleshot from '../../../utils/hof/singleshot';

import useArrayPaginator, { IArrayPaginatorParams } from "./useArrayPaginator"

interface IResult<FilterData = IAnything, RowData extends IRowData = IAnything> {
    handler: ListHandler<FilterData, RowData>;
    clear: () => void;
}

export const useCachedPaginator = <FilterData = IAnything, RowData extends IRowData = IAnything> (
    handler: ListHandler<FilterData, RowData>,
    params: IArrayPaginatorParams<FilterData, RowData>
): IResult<FilterData, RowData> => {
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
