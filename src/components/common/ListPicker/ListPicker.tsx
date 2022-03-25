import * as React from 'react';
import { useState } from 'react';

import { makeStyles } from "../../../styles";

import ModalDialog from '../ModalDialog';
import List from '../../List';

import Box from '@mui/material/Box';
import DialogTitle from '@mui/material/DialogTitle';

import IField from '../../../model/IField';
import IColumn from '../../../model/IColumn';
import IRowData, { RowId } from '../../../model/IRowData';
import IAnything from '../../../model/IAnything';
import { ListHandler } from '../../../model/IListProps';
import SelectionMode from '../../../model/SelectionMode';

interface IListPickerProps<RowData extends IRowData = IAnything> {
  onChange: (data: RowId[] | null) => void;
  handler: ListHandler<RowData>;
  selectionMode: SelectionMode.Single | SelectionMode.Multiple;
  columns?: IColumn<RowData>[];
  filters?: IField[];
  title?: string;
  open?: boolean;
  height?: number;
  width?: number;
}

const useStyles = makeStyles({
  root: {
    minWidth: 425,
    minHeight: 375,
    "& .MuiPaper-root": {
      background: "transparent",
      boxShadow: "none",
    },
  },
});

export const ListPicker = <RowData extends IRowData = IAnything>({
  onChange = (data) => console.log({ data }),
  filters,
  handler,
  title,
  columns,
  open = true,
  selectionMode,
  height: minHeight,
  width: minWidth,
}: IListPickerProps<RowData>) => {
  const [selectedRows, setSelectedRows] = useState<RowId[] | null>(null);
  const classes = useStyles();
  const handleChange = (rows: RowId[]) => setSelectedRows(rows);
  const handleAccept = () => onChange(selectedRows);
  const handleDismis = () => onChange(null);
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
      <Box style={{minHeight, minWidth}} p={3}>
        <List<IAnything, RowData>
          className={classes.root}
          handler={handler}
          filters={filters}
          columns={columns}
          selectionMode={selectionMode}
          onSelectedRows={handleChange}
        />
      </Box>
    </ModalDialog>
  );
};

export default ListPicker;
