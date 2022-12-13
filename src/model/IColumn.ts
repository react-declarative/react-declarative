import ColumnType from "./ColumnType";

import { IListActionOption, ListPayload } from "./IListProps";
import IAnything from './IAnything';
import IRowData from './IRowData';

import { Value } from './IField';

export interface IColumn<RowData extends IRowData = IAnything> {
    type: ColumnType;
    field?: string;
    primary?: boolean;
    secondary?: boolean;
    headerName: string;
    width: string | ((width: number) => string | number);
    minHeight?: string | number;
    phoneOrder?: number;
    phoneHidden?: boolean;
    tabletOrder?: number;
    tabletHidden?: boolean;
    desktopOrder?: number;
    desktopHidden?: boolean;
    columnMenu?: IListActionOption[];
    compute?: (row: RowData, payload: ListPayload) => Promise<Value> | Value;
    element?: React.ComponentType<RowData>;
    sortable?: boolean;
}

export default IColumn;