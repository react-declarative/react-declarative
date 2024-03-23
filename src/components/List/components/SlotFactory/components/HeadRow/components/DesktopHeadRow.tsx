import * as React from "react";
import { useMemo, useCallback } from "react";

import { makeStyles } from "../../../../../../../styles";

import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import Radio from "@mui/material/Radio";
import Tooltip from "@mui/material/Tooltip";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableSortLabel from "@mui/material/TableSortLabel";

import ActionMenu from "../../../../../../ActionMenu";

import IRowData from "../../../../../../../model/IRowData";
import IAnything from "../../../../../../../model/IAnything";

import ColumnType from "../../../../../../../model/ColumnType";
import SelectionMode from "../../../../../../../model/SelectionMode";

import { IHeadRowSlot, HeadColumn } from "../../../../../slots/HeadRowSlot";

import fieldToHeader from "../../../../../helpers/fieldToHeader";

import useCachedRows from "../../../../../hooks/useCachedRows";
import useSortModel from "../../../../../hooks/useSortModel";
import useSelection from "../../../../../hooks/useSelection";
import useReload from "../../../../../hooks/useReload";
import useProps from "../../../../../hooks/useProps";
import usePayload from "../../../../../hooks/usePayload";

const CELL_PADDING_LEFT = 32;

const useStyles = makeStyles()((theme) => ({
  cell: {
    paddingLeft: "0px !important",
    paddingRight: "0 !important",
    background: `${theme.palette.background.paper} !important`,
  },
  bold: {
    fontWeight: "bold !important",
    opacity: 0.7,
  },
  menu: {
    margin: "0 !important",
    padding: "0 !important",
    width: "unset !important",
    height: "unset !important",
    "& .MuiSvgIcon-root": {
      height: "20px !important",
      width: "20px !important",
    },
  },
  cellStretch: {
    width: "100%",
    background: `${theme.palette.background.paper} !important`,
  },
  separator: {
    minWidth: CELL_PADDING_LEFT,
    maxWidth: CELL_PADDING_LEFT,
    background: `${theme.palette.background.paper} !important`,
  },
  checkbox: {
    marginLeft: "4px",
  },
}));

const LOAD_SOURCE = "list-columns";

/**
 * @typedef {Object} DesktopHeadRow - Represents the head row component for a desktop layout.
 * @template RowData - The type of data in each row.
 * @param props - The props object.
 * @param props.fullWidth - Indicates if the head row should take up the full width.
 * @param props.columns - The list of column definitions.
 * @returns - The head row component.
 */
export const DesktopHeadRow = <RowData extends IRowData = IAnything>({
  fullWidth,
  columns,
}: IHeadRowSlot) => {
  const { classes } = useStyles();

  const props = useProps<RowData>();
  const { sortModel, setSortModel } = useSortModel();
  const { selection, setSelection } = useSelection();
  const { selectedRows } = useCachedRows();
  const payload = usePayload();

  const reload = useReload();

  const {
    selectionMode,
    loading,
    onColumnAction,
    onLoadStart,
    onLoadEnd,
    fallback,
  } = props;

  /**
   * Represents whether all rows in the selection are selected.
   *
   * @type {boolean}
   */
  const isAllSelected = useMemo(() => {
    for (const row of props.rows) {
      if (!selection.has(row.id)) {
        return false;
      }
    }
    return !!props.rows.length;
  }, [selection, props.rows]);

  /**
   * Checks if the selection size is not 0 and isAllSelected is false.
   *
   * @type {boolean}
   */
  const isIndeterminate = !!selection.size && !isAllSelected;

  /**
   * Renders a checkbox or radio button based on the selection mode.
   *
   * @returns The rendered checkbox or radio button.
   */
  const renderCheckbox = () => {
    /**
     * Handles the click event of a checkbox.
     * If the selection mode is None, the function returns without performing any action.
     * If the selection mode is Single, the function clears the selection.
     * If the selection mode is not Single and all items are selected, the function clears the selection.
     * Otherwise, the function adds the IDs of the rows from the props to the selection.
     *
     * @returns
     */
    const handleCheckboxClick = () => {
      if (selectionMode === SelectionMode.None) {
        return;
      }
      if (selectionMode === SelectionMode.Single) {
        setSelection(new Set());
        return;
      }
      if (isAllSelected) {
        setSelection(new Set());
        return;
      }
      props.rows.forEach(({ id }) => selection.add(id));
      setSelection(selection);
    };

    /**
     * Handles the click event of the radio button.
     * Clears the current selection by resetting the selection to an empty Set.
     *
     * @function handleRadioClick
     * @returns
     */
    const handleRadioClick = () => {
      setSelection(new Set());
    };

    if (selectionMode === SelectionMode.Single) {
      return (
        <Radio
          className={classes.checkbox}
          key={selection.size}
          disabled={loading}
          color="primary"
          onChange={handleRadioClick}
        />
      );
    } else if (selectionMode === SelectionMode.Multiple) {
      return (
        <Checkbox
          className={classes.checkbox}
          disabled={loading}
          color="primary"
          checked={isAllSelected}
          indeterminate={isIndeterminate}
          onClick={handleCheckboxClick}
        />
      );
    } else {
      return <Checkbox className={classes.checkbox} color="primary" disabled />;
    }
  };

  const handleSortToggle = useCallback(
    (id: string) => {
      const sortModelCopy = new Map(sortModel);
      const sortTarget = sortModel.get(id);
      if (sortTarget) {
        if (sortTarget.sort === "asc") {
          sortModelCopy.set(id, {
            field: id,
            sort: "desc",
          });
        } else if (sortTarget.sort === "desc") {
          sortModelCopy.delete(id);
        }
      } else {
        sortModelCopy.set(id, {
          field: id,
          sort: "asc",
        });
      }
      setSortModel(sortModelCopy);
    },
    [sortModel]
  );

  const handleLoadStart = () => onLoadStart && onLoadStart(LOAD_SOURCE);
  const handleLoadEnd = (isOk: boolean) =>
    onLoadEnd && onLoadEnd(isOk, LOAD_SOURCE);
  const createHandleAction = (field: string) => (action: string) =>
    onColumnAction && onColumnAction(field, action, selectedRows, reload);

  const content = useMemo(() => {
    const renderColumn = (column: HeadColumn, idx: number) => {
      const sortTarget = sortModel.get(column.field || "");
      const sortDirection = sortTarget?.sort || undefined;

      let isSortable = !!column.field;
      isSortable = isSortable && column.sortable !== false;
      isSortable = isSortable && column.type !== ColumnType.Action;

      const handleClick = () => {
        if (isSortable) {
          handleSortToggle(column.field!);
        }
      };

      const minWidth = column.width;
      const maxWidth = minWidth;

      const align = column.type === ColumnType.Action ? "center" : "left";

      const { headerName = fieldToHeader(column.field || "") || "Unknown" } =
        column;

      return (
        <>
          {idx > 0 && <TableCell className={classes.separator} />}
          <TableCell
            className={classes.cell}
            key={idx}
            align={align}
            style={{ minWidth, maxWidth }}
            sortDirection={sortDirection}
          >
            <Box
              sx={{
                width: "calc(100% - 40px)",
                display: "inline-block",
              }}
            >
              {isSortable ? (
                <TableSortLabel
                  className={classes.bold}
                  active={!!sortTarget}
                  direction={sortDirection}
                  onClick={handleClick}
                  disabled={loading}
                >
                  {headerName}
                </TableSortLabel>
              ) : (
                <span className={classes.bold}>{headerName}</span>
              )}
            </Box>
            {!!column.columnMenu && (
              <ActionMenu
                transparent
                className={classes.menu}
                options={column.columnMenu.map(
                  ({
                    isDisabled = () => false,
                    isVisible = () => true,
                    ...other
                  }) => ({
                    ...other,
                    isDisabled: () => isDisabled(selectedRows, payload),
                    isVisible: () => isVisible(selectedRows, payload),
                  })
                )}
                onAction={createHandleAction(column.field || "unset-field")}
                fallback={fallback}
                payload={selectedRows}
                onLoadStart={handleLoadStart}
                onLoadEnd={handleLoadEnd}
                disabled={loading}
                deps={[payload]}
                throwError
              />
            )}
          </TableCell>
        </>
      );
    };

    const content = columns.map(renderColumn);

    return content;

  }, [fullWidth]);

  const computeTooltipLabel = () => {
    if (selectionMode === SelectionMode.Single) {
      return "Deselect";
    }
    if (isIndeterminate) {
      return "Select all";
    }
    return isAllSelected ? "Deselect" : "Select all";
  };

  return (
    <TableRow>
      <TableCell className={classes.cell} padding="checkbox">
        {selectionMode === SelectionMode.None ? (
          <>{renderCheckbox()}</>
        ) : (
          <Tooltip title={computeTooltipLabel()}>{renderCheckbox()}</Tooltip>
        )}
      </TableCell>
      {content}
      <TableCell className={classes.cellStretch} />
    </TableRow>
  );
};

export default DesktopHeadRow;
