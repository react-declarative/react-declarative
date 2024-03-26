import * as React from "react";
import { useMemo, useState } from "react";

import { makeStyles } from "../../../../../../styles";
import { alpha } from "@mui/material";

import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";

import CheckboxBodyCell from "./MobileCheckboxBodyCell";
import CommonBodyCell, { CONTENT_CELL } from "./MobileCommonCell";

import IRowData from "../../../../../../model/IRowData";
import IAnything from "../../../../../../model/IAnything";

import ColumnType from "../../../../../../model/ColumnType";
import SelectionMode from "../../../../../../model/SelectionMode";

import { IBodyRowSlot, BodyColumn } from "../../../../slots/BodyRowSlot";

import classNames from "../../../../../../utils/classNames";

import useProps from "../../../../hooks/useProps";
import useSelection from "../../../../hooks/useSelection";
import useReload from "../../../../hooks/useReload";

/**
 * Returns the styles object for a component.
 * @function
 * @returns {object} The styles object.
 */
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
  hideIfEmpty: {
    [`&:has(.${CONTENT_CELL} > :empty)`]: {
      display: "none",
    },
    [`&:has(.${CONTENT_CELL}:empty)`]: {
      display: "none",
    },
  },
}));

/**
 * Renders a row in the desktop view of the table body.
 *
 * @template RowData - The type of data for each row.
 * @param param - The parameters for rendering the row.
 * @returns - The rendered row component.
 */
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

  const { onRowClick, onRowAction, rowColor = () => 'inherit' } = props;

  /**
   * Function to handle click event.
   * It performs the following actions:
   * - If `menuOpened` is false:
   *   - If `props.withSelectOnRowClick` is true and `props.selectionMode` is not `SelectionMode.None`:
   *     - If `props.selectionMode` is `SelectionMode.Single`:
   *       - If `selection` contains `row.id` and `selection` size is 1, remove `row.id` from `selection`.
   *       - Otherwise, clear `selection` and add `row.id` to `selection`.
   *     - Otherwise, check if `selection` contains `row.id`. If true, remove `row.id` from `selection`,
   *       otherwise add `row.id` to `selection`.
   *     - Set `selection` state with updated `selection`.
   *   - Otherwise, if `onRowClick` is defined, call `onRowClick` callback with `row` and `reload` parameters.
   *
   * @returns
   */
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

  /**
   * Sets the state of the menu based on the provided boolean value.
   *
   * @param opened - Specifies whether the menu is opened or not.
   * @returns
   */
  const handleMenuToggle = (opened: boolean) => {
    setMenuOpened(opened);
  };

  /**
   * Handles an action triggered by the user.
   *
   * @param action - The action to be handled.
   */
  const handleAction = (action: string) => {
    onRowAction && onRowAction(action, row, reload);
  };

  const [firstCol, actionCol, cols] = useMemo(() => {
    /**
     * Creates a render column function based on the given parameters.
     *
     * @param colSpan - The column span.
     * @param prefix - The column prefix.
     * @param withLabel - Indicates whether to render a label.
     * @param disableGutters - Indicates whether to disable gutters.
     *
     * @returns The render column function.
     */
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
            className={classNames(column.type !== ColumnType.Component && classes.hideIfEmpty)}
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

    /**
     * Represents the action column.
     *
     */
    const [actionCol = null] = columns
      .filter(({ type }) => type === ColumnType.Action)
      .map(createRenderColumn(1, "action", false, true));

    /**
     * A variable representing the first column.
     *
     */
    const firstCol = commonCols
      .slice(0, 1)
      .map(createRenderColumn(1, "first", true, true))
      .pop();

    /**
     * Retrieves the primary column from the commonCols array.
     *
     */
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
        background: rowColor(row),
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
              <TableRow key={idx} >{col}</TableRow>
            ))}
          </TableBody>
        </Table>
      </TableCell>
    </TableRow>
  );
};

export default DesktopBodyRow;
