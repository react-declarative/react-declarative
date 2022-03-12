import { GridColDef } from "@mui/x-data-grid";

import IColumn from "../model/IColumn";
import ColumnType from "../model/ColumnType";

import isUndefined from "../utils/isUndefined";
import randomString from "../utils/randomString";

import { renderComponentCell } from "../components/List/components/Desktop/components/ComponentCell";
import { renderCheckBoxCell } from "../components/List/components/Desktop/components/CheckboxCell";
import { renderComputeCell } from "../components/List/components/Desktop/components/ComputeCell";
import { renderActionCell } from "../components/List/components/Desktop/components/ActionCell";
import { renderTextCell } from "../components/List/components/Desktop/components/TextCell";
import { renderHeader } from "../components/List/components/Desktop/components/Header";

import { INTERNAL_COLUMN_NAME } from "../components/List/components/Desktop/config";

import computeStyle from "../components/List/components/Desktop/computeStyle";

export const createColumn = (column: IColumn): GridColDef => {
    const field = column.field || `_${randomString()}`;
    column[INTERNAL_COLUMN_NAME] = field;
    const {
        type,
        headerName,
        width,
        sortComparator,
        columnMenu = undefined,
        sortable = true,
        showColumnMenu = false,
    } = column;
    const baseFields = {
        field,
        ...(!isUndefined(headerName) && {headerName}),
        ...(!isUndefined(sortable) && {sortable}),
        ...(!isUndefined(sortComparator) && {sortComparator}),
        ...(!isUndefined(width) && {width: computeStyle(width)}),
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
    } else if (type === ColumnType.Compute) {
        return {
            renderHeader,
            renderCell: renderComputeCell,
            ...baseFields,
        };
    } else if (type === ColumnType.Component) {
        return {
            renderHeader,
            renderCell: renderComponentCell,
            ...baseFields,
        };
    } else if (type === ColumnType.Action) {
        return {
            renderHeader,
            renderCell: renderActionCell,
            ...baseFields,
            sortable: false,
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