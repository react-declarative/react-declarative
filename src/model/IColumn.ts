import ColumnType from "./ColumnType";

import IAnything from './IAnything';
import IRowData from './IRowData';
import IOption from './IOption';

import { Value } from './IField';

export interface IColumn<RowData extends IRowData = IAnything> {
    type: ColumnType;
    field?: string;
    primary?: boolean;
    secondary?: boolean;
    headerName: string;
    width: string | (() => string | number);
    columnMenu?: IOption[];
    showColumnMenu?: boolean;
    compute?: (row: RowData) => Promise<Value> | Value;
    element?: React.ComponentType<RowData>;
    sortable?: boolean;
}

export default IColumn;