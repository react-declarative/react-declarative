import * as React from "react";
import { useState, createElement } from "react";

import { makeStyles } from "../../../../../../styles";

import MatListItem from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Box from "@mui/material/Box";

import Async from "../../../../../Async";
import ActionMenu from "../../../../../ActionMenu";

import IListProps from "../../../../../../model/IListProps";
import IAnything from "../../../../../../model/IAnything";
import IRowData from "../../../../../../model/IRowData";
import IColumn from "../../../../../../model/IColumn";

import useReload from "../../../../hooks/useReload";
import usePayload from "../../../../hooks/usePayload";
import useProps from "../.../../../../../hooks/useProps";
import useSelection from "../../../../hooks/useSelection";
import useActualValue from "../../../../../../hooks/useActualValue";

import RowCheckbox from "./common/RowCheckbox";
import RowMark from "./common/RowMark";
import SelectionMode from "../../../../../../model/SelectionMode";

const LOAD_SOURCE = "list-item";

/**
 * Render the content for a column in a table row.
 *
 * @template RowData - The type of the row data.
 * @param params - The parameters for rendering the column content.
 * @param params.row - The data for the table row.
 * @param [params.fallback] - The fallback content to display while loading.
 * @param [params.column] - The column configuration for the table.
 * @returns - The rendered column content.
 */
const ColumnContent = <RowData extends IRowData = IAnything>({
  row,
  fallback,
  column,
}: {
  row: RowData;
  fallback?: IListProps["fallback"];
  column?: IColumn<RowData>;
}) => {
  const { onLoadStart, onLoadEnd } = useProps();

  const payload = usePayload();

  const handleLoadStart = () => onLoadStart && onLoadStart(LOAD_SOURCE);
  const handleLoadEnd = (isOk: boolean) =>
    onLoadEnd && onLoadEnd(isOk, LOAD_SOURCE);

  return (
    <Async
      fallback={fallback}
      payload={row}
      onLoadStart={handleLoadStart}
      onLoadEnd={handleLoadEnd}
      throwError
    >
      {() => {
        if (column && column.element) {
          return createElement(column.element, row);
        } else if (column && column.compute) {
          return column.compute(row, payload);
        } else if (column && column.field) {
          return row[column.field];
        } else {
          return "empty";
        }
      }}
    </Async>
  );
};

const useStyles = makeStyles()({
  root: {
    position: "relative",
    overflow: "hidden",
  },
  checkbox: {
    opacity: 0.2,
  },
});

/**
 * Represents the props for the ChooserListItem component.
 *
 * @template RowData - The type of the row data.
 */
interface IChooserListItemProps<RowData extends IRowData = IAnything> {
  row: RowData;
  style?: React.CSSProperties;
}

/**
 * Represents a list item in the chooser component.
 * @template RowData - The type of data in the row.
 * @param props - The props for the list item component.
 * @param props.row - The data for the row.
 * @param props.style - The CSS styles for the list item.
 * @returns The rendered list item component.
 */
export const ListItem = <RowData extends IRowData = IAnything>({
  row,
  style,
}: IChooserListItemProps<RowData>) => {
  const [menuOpened, setMenuOpened] = useState(false);
  const { classes } = useStyles();

  const {
    columns = [],
    withSelectOnRowClick,
    selectionMode,
    rowActions,
    onRowClick,
    onRowAction,
    rowMark,
    fallback,
    onLoadStart,
    onLoadEnd,
  } = useProps();

  const reload = useReload();
  const payload = usePayload();

  const { selection, setSelection } = useSelection();
  const row$ = useActualValue(row);

  const primaryColumn =
    columns.find(({ primary }) => primary) ||
    columns.find(({ field }) => !!field);
  const secondaryColumn = columns.find(({ secondary }) => secondary);
  const avararColumn = columns.find(({ avatar }) => avatar);

  /**
   * Represents the primary variable.
   *
   * @typedef {React.ReactElement} Primary
   * @property {RowData} row - The row data.
   * @property {string | React.ReactElement} fallback - The fallback value or element.
   * @property {Column<RowData>} column - The primary column.
   */
  const primary = (
    <ColumnContent<RowData>
      row={row}
      fallback={fallback}
      column={primaryColumn}
    />
  );

  /**
   * The `secondary` variable is used to store the result of a ternary operation.
   *
   * @type {ColumnContent<RowData>|null} The content displayed in the secondary column.
   *
   * @param {RowData} row - The data of a row.
   * @param {any} fallback - The fallback value if `secondaryColumn` is falsy.
   * @param {Column} secondaryColumn - The secondary column to be displayed if truthy.
   *
   * @returns {ColumnContent<RowData>|null} The content displayed in the secondary column,
   * or `null` if `secondaryColumn` is falsy.
   */
  const secondary = secondaryColumn ? (
    <ColumnContent<RowData>
      row={row}
      fallback={fallback}
      column={secondaryColumn}
    />
  ) : null;

  /**
   * Represents an avatar.
   *
   * @typedef {import("path/to/ColumnContent").ColumnContent} ColumnContent
   * @typedef {import("path/to/RowData").RowData} RowData
   *
   * @property {ColumnContent<RowData> | null} avatarColumn - The column content representing the avatar.
   * @property {RowData} row - The row data for the avatar.
   * @property {string} fallback - The fallback value for the avatar.
   */
  const avatar = avararColumn ? (
    <ColumnContent<RowData>
      row={row}
      fallback={fallback}
      column={avararColumn}
    />
  ) : null;

  /**
   * Handles click events for the menu.
   * If the menu is not opened, it performs different actions based on the configuration:
   * - If withSelectOnRowClick is true and selectionMode is not SelectionMode.None,
   *   it modifies the selection based on the selectionMode and the current selection state.
   * - If withSelectOnRowClick is false or selectionMode is SelectionMode.None,
   *   it calls the onRowClick function with the row and reload parameters.
   */
  const handleClick = () => {
    if (!menuOpened) {
      if (withSelectOnRowClick && selectionMode !== SelectionMode.None) {
        if (selectionMode === SelectionMode.Single) {
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
   * @returns
   */
  const handleMenuToggle = (opened: boolean) => {
    setMenuOpened(opened);
  };

  const handleAction = (action: string) => {
    onRowAction && onRowAction(action, row, reload);
  };

  const handleLoadStart = () => onLoadStart && onLoadStart(LOAD_SOURCE);
  const handleLoadEnd = (isOk: boolean) =>
    onLoadEnd && onLoadEnd(isOk, LOAD_SOURCE);

  return (
    <MatListItem
      selected={selection.has(row.id)}
      className={classes.root}
      onClick={handleClick}
      style={style}
      disableRipple={menuOpened}
    >
      {!!rowMark && <RowMark row={row} />}
      <ListItemIcon sx={{ display: 'flex', alignItems: 'center', gap: '8px', }}>
        <RowCheckbox row={row} />
        {!!avatar && (
          <Box sx={{ marginRight: '16px' }}>
            {avatar}
          </Box>
        )}
      </ListItemIcon>
      <ListItemText primary={primary} secondary={secondary} />
      {!!rowActions && (
        <ActionMenu
          transparent
          options={rowActions.map(
            ({
              isDisabled = () => false,
              isVisible = () => true,
              ...other
            }) => ({
              ...other,
              isVisible: () => isVisible(row$.current, payload),
              isDisabled: () => isDisabled(row$.current, payload),
            })
          )}
          onToggle={handleMenuToggle}
          onAction={handleAction}
          fallback={fallback}
          payload={row}
          deps={[payload]}
          onLoadStart={handleLoadStart}
          onLoadEnd={handleLoadEnd}
          throwError
        />
      )}
    </MatListItem>
  );
};

export default ListItem;
