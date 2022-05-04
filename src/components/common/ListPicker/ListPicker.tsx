import * as React from 'react';
import { useState } from 'react';

import { makeStyles } from "../../../styles";

import ModalDialog from '../ModalDialog';
import List from '../../List';

import Box from '@mui/material/Box';
import DialogTitle from '@mui/material/DialogTitle';

import { MOBILE_LIST_ROOT } from '../../List/components/view/ChooserView';

import IRowData, { RowId } from '../../../model/IRowData';
import IListProps from '../../../model/IListProps';
import IAnything from '../../../model/IAnything';
import IColumn from '../../../model/IColumn';

import SelectionMode from '../../../model/SelectionMode';

export interface IListPickerProps<RowData extends IRowData = IAnything> {
  onChange: (data: RowId[] | null) => void;
  handler: IListProps<RowData>['handler'];
  selectionMode: SelectionMode.Single | SelectionMode.Multiple;
  columns: Omit<IColumn<RowData>, keyof {
    headerName: never;
    width: never;
  }>[];
  selectedRows: NonNullable<IListProps<RowData>['selectedRows']> | null;
  minHeight: number;
  minWidth: number;
  title: string;
  open: boolean;
}

const useStyles = makeStyles({
  root: {
    "& .MuiPaper-root": {
      background: "transparent",
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
  selectedRows: selectedRowsDefault = null,
  minHeight,
  minWidth,
}: IListPickerProps<RowData>) => {
  const [selectedRows, setSelectedRows] = useState(selectedRowsDefault);
  const classes = useStyles();
  const handleChange = (rows: RowId[], initialChange: boolean) => {
    if (!initialChange) {
      setSelectedRows(rows);
    }
  };
  const handleAccept = () => onChange(selectedRows);
  const handleDismis = () => onChange(null);
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
      onDismis={handleDismis}
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
          showLoader
          isChooser
          handler={handler}
          columns={columns as IColumn<RowData>[]}
          selectedRows={selectedRows || undefined}
          selectionMode={selectionMode}
          onSelectedRows={handleChange}
          onRowClick={handleClick}
        />
      </Box>
    </ModalDialog>
  );
};

export default ListPicker;
