import * as React from 'react';
import { useState } from 'react';

import { makeStyles } from "../../../styles";

import ModalDialog from '../ModalDialog';
import List from '../../List';

import Box from '@mui/material/Box';
import DialogTitle from '@mui/material/DialogTitle';

import { MOBILE_LIST_ROOT } from '../../List/components/Mobile';

import IRowData, { RowId } from '../../../model/IRowData';
import IAnything from '../../../model/IAnything';
import IListProps from '../../../model/IListProps';

import SelectionMode from '../../../model/SelectionMode';
import DisplayMode from '../../../model/DisplayMode';

export interface IListPickerProps<RowData extends IRowData = IAnything> {
  onChange: (data: RowId[] | null) => void;
  handler: IListProps<RowData>['handler'];
  selectionMode: SelectionMode.Single | SelectionMode.Multiple;
  columns: IListProps<RowData>['columns'];
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
      boxShadow: "none",
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
    if (selectedRows) {
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
          displayMode={DisplayMode.Mobile}
          handler={handler}
          columns={columns}
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
