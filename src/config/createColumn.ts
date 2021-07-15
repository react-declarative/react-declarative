import { GridColDef } from "@material-ui/data-grid";

import IColumn from "../model/IColumn";
import ColumnType from "../model/ColumnType";

import { renderCheckBoxCell } from "../components/List/components/Desktop/components/CheckboxCell";
import { renderActionCell } from "../components/List/components/Desktop/components/ActionCell";
import { renderTextCell } from "../components/List/components/Desktop/components/TextCell";
import { renderHeader } from "../components/List/components/Desktop/components/Header";

import computeStyle from "../components/List/components/Desktop/computeStyle";

export const createColumn = (column: IColumn): GridColDef => {
    const {
        type,
        field = '_',
        headerName,
        width,
        cellComparator,
        columnMenu = undefined,
        sortable = true,
        showColumnMenu = false,
    } = column;
    const baseFields = {
        headerName,
        field,
        sortable,
        cellComparator,
        width: computeStyle(width),
        disableColumnMenu: !columnMenu && !showColumnMenu,
    };
    if (type === ColumnType.Text) {
        return {
            renderHeader,
            renderCell: renderTextCell,
            ...baseFields,
        };
    } else if (type === ColumnType.CheckBox) {
        return {
            renderHeader,
            renderCell: renderCheckBoxCell,
            ...baseFields,
        };
    } else if (type === ColumnType.Action) {
        return {
            renderHeader,
            renderCell: renderActionCell,
            ...baseFields,
        };
    } else if (type === ColumnType.Custom) {
        const {
            renderCell,
            renderHeader,
        } = column;
      return {
        renderCell,
        renderHeader,
        ...baseFields,
      };
    } else {
        throw new Error("ColumnFactory unknown key type");
    }
};

export default createColumn;