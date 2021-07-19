
import {
    GridCellParams,
    GridColumnHeaderParams,
    GridComparatorFn,
} from '@material-ui/data-grid';

import ColumnType from "./ColumnType";

import IAnything from './IAnything';
import IRowData from './IRowData';
import IOption from './IOption';

export interface IColumn<RowData extends IRowData = IAnything> {
    type: ColumnType;
    field?: string;
    headerName: string;
    width: string;
    columnMenu?: IOption[];
    showColumnMenu?: boolean;
    sizerCellPadding?: {
        paddingTop: number;
        paddingLeft: number;
        paddingRight: number;
        paddingBottom: number;
    };
    sizerCellStyle?: {
        whiteSpace: string,
        overflowWrap: string,
        lineHeight: string,
        fontSize: string,
        fontWeight: string,
        border: string,
    };
    requiredHeight?: number;
    sizerGetText?: (row: RowData) => string;
    renderCell?: (props: GridCellParams) => JSX.Element;
    renderHeader?: (props: GridColumnHeaderParams) => JSX.Element;
    sortComparator?: GridComparatorFn;
    sortable?: boolean;
}

export default IColumn;