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
    width: string | ((width: number) => string | number);
    minHeight?: string | number;
    phoneOrder?: number;
    phoneHidden?: boolean;
    tabletOrder?: number;
    tabletHidden?: boolean;
    desktopOrder?: number;
    desktopHidden?: boolean;
    columnMenu?: IOption[];
    showColumnMenu?: boolean;
    compute?: (row: RowData) => Promise<Value> | Value;
    element?: React.ComponentType<RowData>;
    sortable?: boolean;
}

export default IColumn;