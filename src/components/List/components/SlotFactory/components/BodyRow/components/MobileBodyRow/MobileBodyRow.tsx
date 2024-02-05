import * as React from "react";
import { useMemo, useState } from "react";

import { makeStyles } from "../../../../../../../../styles";
import { alpha } from "@mui/material";

import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";

import CheckboxBodyCell from "./MobileCheckboxBodyCell";
import CommonBodyCell from "./MobileCommonCell";

import IRowData from "../../../../../../../../model/IRowData";
import IAnything from "../../../../../../../../model/IAnything";

import ColumnType from "../../../../../../../../model/ColumnType";
import SelectionMode from "../../../../../../../../model/SelectionMode";

import { IBodyRowSlot, BodyColumn } from "../../../../../../slots/BodyRowSlot";

import classNames from "../../../../../../../../utils/classNames";

import useProps from "../../../../../../hooks/useProps";
import useSelection from "../../../../../../hooks/useSelection";
import useReload from "../../../../../../hooks/useReload";

const useStyles = makeStyles()((theme) => ({
  root: {
    "&:nth-of-type(2n)": {
      background: alpha(
        theme.palette.getContrastText(theme.palette.background.paper),
        0.04
      ),
    },
    "& > .MuiTableCell-root": {
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
    overflow: "hidden",
  },
  row: {
    "& .MuiTableCell-root": {
      borderBottom: "0 !important",
      overflow: "hidden",
    },
    marginBottom: 16,
  },
  disabled: {
    pointerEvents: "none",
    opacity: 0.5,
  },
}));

export const DesktopBodyRow = <RowData extends IRowData = IAnything>({
  row,
  mode,
  disabled,
  columns,
  fullWidth,
}: IBodyRowSlot<RowData>) => {
  const [menuOpened, setMenuOpened] = useState(false);
  const { classes } = useStyles();

  const props = useProps<RowData>();
  const reload = useReload();

  const { selection, setSelection } = useSelection();

  const { onRowClick, onRowAction } = props;

  const handleClick = () => {
    if (!menuOpened) {
      if (
        props.withSelectOnRowClick &&
        props.selectionMode !== SelectionMode.None
      ) {
        if (props.selectionMode === SelectionMode.Single) {
          if (selection.has(row.id) && selection.size === 1) {
            selection.delete(row.id);
          } else {
            selection.clear();
            selection.add(row.id);
          }
        } else {
          selection.has(row.id)
            ? selection.delete(row.id)
            : selection.add(row.id);
        }
        setSelection(selection);
      } else {
        onRowClick && onRowClick(row, reload);
      }
    }
  };

  const handleMenuToggle = (opened: boolean) => {
    setMenuOpened(opened);
  };

  const handleAction = (action: string) => {
    onRowAction && onRowAction(action, row, reload);
  };

  const [firstCol, actionCol, cols] = useMemo(() => {
    const createRenderColumn =
      (
        colSpan: number,
        prefix: string,
        withLabel: boolean,
        disableGutters: boolean
      ) =>
      (column: BodyColumn, idx: number) =>
        (
          <CommonBodyCell
            column={column}
            disabled={disabled}
            row={row}
            key={`${prefix}-${idx}`}
            idx={idx}
            mode={mode}
            colSpan={colSpan}
            fullWidth={fullWidth}
            onAction={handleAction}
            withLabel={withLabel}
            disableGutters={disableGutters}
            onMenuToggle={handleMenuToggle}
          />
        );

    const commonCols = columns.filter(({ type }) => type !== ColumnType.Action);

    const [actionCol = null] = columns
      .filter(({ type }) => type === ColumnType.Action)
      .map(createRenderColumn(1, "action", false, true));

    const firstCol = commonCols
      .slice(0, 1)
      .map(createRenderColumn(1, "first", true, true))
      .pop();

    const primaryCol = commonCols
      .filter(({ primary }) => primary)
      .map(createRenderColumn(1, "primary", true, true))
      .pop();

    const cols = (primaryCol ? commonCols : commonCols.slice(1)).map(
      createRenderColumn(actionCol ? 3 : 2, "col", true, false)
    );

    return [primaryCol || firstCol, actionCol, cols];
  }, [fullWidth]);

  const maxWidth = useMemo(() => Math.max(fullWidth - 35, 0), [fullWidth]);

  return (
    <TableRow
      className={classes.root}
      selected={selection.has(row.id)}
      sx={{
        maxWidth,
      }}
      onClick={handleClick}
    >
      <TableCell
        padding="none"
        sx={{
          maxWidth,
        }}
      >
        <Table
          className={classNames(classes.row, {
            [classes.disabled]: disabled,
          })}
        >
          <TableBody>
            <TableRow>
              <CheckboxBodyCell disabled={disabled} row={row} />
              {firstCol}
              {actionCol}
            </TableRow>
            {cols.map((col, idx) => (
              <TableRow key={idx}>{col}</TableRow>
            ))}
          </TableBody>
        </Table>
      </TableCell>
    </TableRow>
  );
};

export default DesktopBodyRow;
