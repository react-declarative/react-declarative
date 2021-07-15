import * as React from 'react';

import {
    GridCellParams,
    GridColumnHeaderParams,
} from '@material-ui/data-grid';

import ColumnType from "./ColumnType";

import IAnything from './IAnything';
import IRowData from './IRowData';

export interface IColumn<RowData extends IRowData = IAnything> {
    type: ColumnType;
    field: string;
    headerName: string;
    width: number;
    columnMenu?: {
        label: string;
        action: string;
    }[];
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
    sizerGetText?: (row: RowData) => string;
    renderCell?: (props: GridCellParams) => JSX.Element;
    renderHeader?: (props: GridColumnHeaderParams) => JSX.Element;
    sortable?: boolean;
}

export default IColumn;