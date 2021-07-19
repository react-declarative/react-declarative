import * as React from 'react';
import { makeStyles } from '@material-ui/core';
import { useState } from 'react';

import ModalDialog from '../ModalDialog';
import List from '../../List';

import Box from '@material-ui/core/Box';
import DialogTitle from '@material-ui/core/DialogTitle';

import IField from '../../../model/IField';
import IColumn from '../../../model/IColumn';
import IRowData from '../../../model/IRowData';
import IAnything from '../../../model/IAnything';
import { ListHandler } from '../../../model/IListProps';
import SelectionMode from '../../../model/SelectionMode';

interface IListPickerProps<RowData extends IRowData = IAnything> {
  onChange: (data: RowData[] | null) => void;
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
  onChange = (data: RowData[] | null) => console.log({ data }),
  filters,
  handler,
  title,
  columns,
  open = true,
  selectionMode,
  height: minHeight,
  width: minWidth,
}: IListPickerProps<RowData>) => {
  const [selectedRows, setSelectedRows] = useState<RowData[] | null>(null);
  const classes = useStyles();
  const handleChange = (rows: RowData[]) => setSelectedRows(rows);
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
