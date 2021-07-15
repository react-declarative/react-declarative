import { GridColDef } from "@material-ui/data-grid";

import IColumn from "../model/IColumn";
import ColumnType from "../model/ColumnType";

import { renderCheckBoxCell } from "../components/List/components/Desktop/columns/CheckboxCell";
import { renderActionCell } from "../components/List/components/Desktop/columns/ActionCell";
import { renderTextCell } from "../components/List/components/Desktop/columns/TextCell";
import { renderHeader } from "../components/List/components/Desktop/columns/Header";

export const createColumn = (column: IColumn): GridColDef => {
    const {
        type,
        field,
        headerName,
        width,
        sortable = true,
        columnMenu,
    } = column;
    const baseFields = {
        headerName,
        field,
        width,
        sortable,
        disableColumnMenu: !columnMenu,
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