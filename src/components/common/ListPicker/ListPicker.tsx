import * as React from 'react';
import { useState } from 'react';

import { makeStyles } from "../../../styles";

import ModalDialog from '../ModalDialog';
import List from '../../List';

import Box from '@mui/material/Box';
import DialogTitle from '@mui/material/DialogTitle';

import { MOBILE_LIST_ROOT } from '../../List/components/view/ChooserView';
import { CONTAINER_MARK } from '../../List/components/Container';

import IRowData, { RowId } from '../../../model/IRowData';
import IListProps from '../../../model/IListProps';
import IAnything from '../../../model/IAnything';
import IColumn from '../../../model/IColumn';

import SelectionMode from '../../../model/SelectionMode';
import IListRowAction from '../../../model/IListRowAction';

import useChange from '../../../hooks/useChange';

/**
 * Represents the props for the IListPicker component.
 * @template RowData - The type of data for each row in the list.
 */
export interface IListPickerProps<RowData extends IRowData = IAnything> {
  onChange: (data: RowId[] | null) => void;
  handler: IListProps<RowData>['handler'];
  selectionMode: SelectionMode.Single | SelectionMode.Multiple;
  columns: Omit<IColumn<RowData>, keyof {
    headerName: never;
    width: never;
  }>[];
  selectedRows: NonNullable<IListProps<RowData>['selectedRows']> | null;
  payload?: IListProps<RowData>['payload'];
  features?: IListProps<RowData>['features'];
  minHeight: number;
  minWidth: number;
  title: string;
  open: boolean;
  rowActions?: IListRowAction[];
}

const useStyles = makeStyles()({
  root: {
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'stretch',
    "& .MuiPaper-root": {
      background: "transparent",
    },
    [`& .${CONTAINER_MARK}`]: {
      flex: 1,
      height: 'unset !important',
      width: 'unset !important',
    },
    [`& .${MOBILE_LIST_ROOT}`]: {
      background: "transparent !important",
    },
  },
});

/**
 * ListPicker component displays a list of items in a modal dialog and allows the user to make a selection.
 *
 * @template RowData - The type of data displayed in each row of the list.
 *
 * @param props - The component props.
 * @param props.onChange - The callback function that is called when the user selects or dismisses the selection. Receives an array of selected rows or null
 * if dismissed.
 * @param props.handler - The handler function for the list.
 * @param props.title - The title of the modal dialog.
 * @param props.columns - The list of columns to be displayed in the list.
 * @param props.open - Whether to show the modal dialog or not.
 * @param props.selectionMode - The selection mode for the list.
 * @param props.selectedRows - The initially selected rows in the list.
 * @param props.minHeight - The minimum height of the list container.
 * @param props.minWidth - The minimum width of the list container.
 * @param props.rowActions - The actions to be displayed for each row in the list.
 *
 * @returns The rendered ListPicker component.
 */
export const ListPicker = <RowData extends IRowData = IAnything>({
  onChange = (data) => console.log({ data }),
  handler,
  title,
  columns,
  open = true,
  selectionMode,
  selectedRows: upperSelectedRows = null,
  minHeight,
  minWidth,
  rowActions,
}: IListPickerProps<RowData>) => {
  const [selectedRows, setSelectedRows] = useState(upperSelectedRows);
  const { classes } = useStyles();
  useChange(() => {
    if (!open) {
      setSelectedRows(upperSelectedRows);
    }
  }, [upperSelectedRows]);
  /**
   * Modifies the state of selected rows based on the given parameters.
   *
   * @param rows - The array of row ids to modify the state for.
   * @param initialChange - A flag indicating if this is the initial change or not.
   *                                 If false, it sets `selectedRows` to the provided `rows`.
   */
  const handleChange = (rows: RowId[], initialChange: boolean) => {
    if (!initialChange) {
      setSelectedRows(rows);
    }
  };
  /**
   * Callback function called when accepting changes.
   *
   * @function handleAccept
   * @memberof module:yourModule
   * @param onChange - The function to be called with selected rows as an argument.
   * @returns
   */
  const handleAccept = () => onChange(selectedRows);
  /**
   * Handles the dismiss event.
   * This function is responsible for calling the onChange function with a null value.
   *
   * @function
   * @name handleDismiss
   * @returns
   */
  const handleDismiss = () => onChange(null);
  /**
   * Handles click event on row in a table.
   *
   * @param data - The row data containing the id of the clicked row.
   *
   * @return
   */
  const handleClick = ({ id: rowId }: RowData) => setSelectedRows((selectedRows) => {
    if (selectedRows && selectionMode === SelectionMode.Multiple) {
      return [...selectedRows, rowId];
    } else {
      return [rowId];
    }
  });
  return (
    <ModalDialog
      open={open}
      onAccept={handleAccept}
      onDismiss={handleDismiss}
    >
      {!!title && (
        <DialogTitle>
          <Box mr={3}>
            {title}
          </Box>
        </DialogTitle>
      )}
      <Box className={classes.root} style={{minHeight, minWidth}}>
        <List<IAnything, RowData>
          sizeByElement
          withLoader
          withSelectOnRowClick
          isChooser
          handler={handler}
          columns={columns as IColumn<RowData>[]}
          selectedRows={selectedRows || undefined}
          selectionMode={selectionMode}
          onSelectedRows={handleChange}
          onRowClick={handleClick}
          rowActions={rowActions}
        />
      </Box>
    </ModalDialog>
  );
};

export default ListPicker;
