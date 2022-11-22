import { IListState } from "./IListProps";

import IAnything from "./IAnything";
import IRowData from "./IRowData";

export interface IListApi<FilterData extends {} = IAnything, RowData extends IRowData = IAnything> {
    reload: (keepPagination?: boolean) => Promise<void>;
    setLimit: (limit: number) => void;
    setPage: (page: number) => void;
    setRows: (rows: RowData[]) => void;
    getState: () => IListState<FilterData, RowData>;
}

export default IListApi;
