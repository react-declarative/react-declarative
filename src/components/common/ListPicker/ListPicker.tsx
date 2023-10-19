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
  const handleChange = (rows: RowId[], initialChange: boolean) => {
    if (!initialChange) {
      setSelectedRows(rows);
    }
  };
  const handleAccept = () => onChange(selectedRows);
  const handleDismiss = () => onChange(null);
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
          sizeByParent
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
