import * as React from "react";
import { useMemo, useState } from "react";
import { makeStyles } from "../../../../../../styles";

import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";

import CheckboxBodyCell from "./DesktopCheckboxBodyCell";
import CommonBodyCell from "./DesktopCommonCell";

import IRowData from "../../../../../../model/IRowData";
import IAnything from "../../../../../../model/IAnything";

import SelectionMode from "../../../../../../model/SelectionMode";

import { IBodyRowSlot, BodyColumn } from "../../../../slots/BodyRowSlot";

import useProps from "../../../../hooks/useProps";
import useReload from "../../../../hooks/useReload";
import useSelection from "../../../../hooks/useSelection";

import classNames from "../../../../../../utils/classNames";

const CELL_PADDING_LEFT = 32;

const useStyles = makeStyles()({
  root: {},
  cellStretch: {
    width: "100%",
  },
  separator: {
    minWidth: CELL_PADDING_LEFT,
    maxWidth: CELL_PADDING_LEFT,
  },
  disabled: {
    pointerEvents: "none",
    opacity: 0.5,
  },
});

/**
 * Render a row in the desktop body of a table.
 *
 * @template RowData - The type of the row data in the table.
 *
 * @param props - The properties for the row.
 * @param props.row - The data for the row.
 * @param props.mode - The current mode of the table.
 * @param props.columns - The columns to render in the row.
 * @param props.disabled - Indicates if the row is disabled.
 * @param props.fullWidth - Indicates if the row should fill the width of the table.
 *
 * @returns - The rendered row component.
 */
export const DesktopBodyRow = <RowData extends IRowData = IAnything>({
  row,
  mode,
  columns,
  disabled,
  fullWidth,
}: IBodyRowSlot<RowData>) => {
  const [menuOpened, setMenuOpened] = useState(false);
  const { classes } = useStyles();

  const props = useProps<RowData>();
  const reload = useReload();

  const { selection, setSelection } = useSelection();

  const { onRowClick, onRowAction, rowColor = () => 'inherit' } = props;

  /**
   * The handleClick function handles the click event for a specific row.
   * It performs different actions based on the current state of the menu and
   * the selection mode of the table.
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
   * Handles the toggling of the menu.
   *
   * @param opened - Indicates whether the menu should be opened or closed.
   */
  const handleMenuToggle = (opened: boolean) => {
    setMenuOpened(opened);
  };

  /**
   * Handles the given action by calling the onRowAction function with the provided parameters.
   *
   * @param action - The action to handle.
   * @returns
   */
  const handleAction = (action: string) => {
    onRowAction && onRowAction(action, row, reload);
  };

  /**
   * Returns the content of a useMemo hook.
   *
   * @param {Array} columns - An array of BodyColumn objects representing the columns.
   * @param  fullWidth - A boolean indicating if the content should be displayed in full width.
   * @param  row - An object representing the row data.
   * @param  disabled - A boolean indicating if the content should be disabled.
   * @param  mode - A string representing the mode of the content.
   * @param  handleAction - A function to be called when an action is triggered.
   * @param  handleMenuToggle - A function to be called when the menu is toggled.
   * @returns  The content of the useMemo hook.
   */
  const content = useMemo(() => {
    /**
     * Renders a single column in the body of a table.
     *
     * @param column - The column to render.
     * @param idx - The index of the column.
     *
     * @returns - The rendered column.
     */
    const renderColumn = (column: BodyColumn, idx: number) => (
      <>
        {idx > 0 && <TableCell className={classes.separator} />}
        <CommonBodyCell
          column={column}
          disabled={disabled}
          row={row}
          key={idx}
          idx={idx}
          mode={mode}
          fullWidth={fullWidth}
          onAction={handleAction}
          onMenuToggle={handleMenuToggle}
        />
      </>
    );

    const content = columns.map(renderColumn);

    return content;
  }, [fullWidth, row, disabled]);

  return (
    <TableRow
      className={classNames(classes.root, {
        [classes.disabled]: disabled,
      })}
      sx={{
        background: rowColor(row)
      }}
      selected={selection.has(row.id)}
      onClick={handleClick}
    >
      <CheckboxBodyCell disabled={disabled} row={row} />
      {content}
      <TableCell className={classes.cellStretch} />
    </TableRow>
  );
};

export default DesktopBodyRow;
