import ColumnType from "./ColumnType";

import IAnything from './IAnything';
import IRowData from './IRowData';
import IOption from './IOption';

import { Value } from './IField';

type WidthFn = string | ((width: number) => string | number);

export interface IColumn<RowData extends IRowData = IAnything> {
    type: ColumnType;
    field?: string;
    primary?: boolean;
    secondary?: boolean;
    headerName: string;
    width?: WidthFn;
    hidden?: boolean;
    phoneWidth?: WidthFn;
    phoneHidden?: boolean;
    tabletWidth?: WidthFn;
    tabletHidden?: boolean;
    desktopWidth?: WidthFn;
    desktopHidden?: boolean;
    columnMenu?: IOption[];
    showColumnMenu?: boolean;
    compute?: (row: RowData) => Promise<Value> | Value;
    element?: React.ComponentType<RowData>;
    sortable?: boolean;
}

export default IColumn;