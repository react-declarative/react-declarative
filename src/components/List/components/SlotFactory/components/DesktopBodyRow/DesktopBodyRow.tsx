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

  const content = useMemo(() => {
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
