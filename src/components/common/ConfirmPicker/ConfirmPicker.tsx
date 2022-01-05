import * as React from 'react';

import ModalDialog from '../ModalDialog';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';

interface IConfirmPickerProps {
  onChange: (result: boolean) => void;
  title: string;
  msg: string;
  open?: boolean;
  canCancel?: boolean;
}

export const ConfirmPicker = ({
  onChange = (result: boolean) => console.log({ result }),
  canCancel = true,
  title,
  msg,
  open = true,
}: IConfirmPickerProps) => {
  const handleAccept = () => onChange(true);
  const handleDismis = () => onChange(false);
  return (
    <ModalDialog
      open={open}
      canCancel={canCancel}
      onAccept={handleAccept}
      onDismis={handleDismis}
    >
      <DialogTitle>
        <Box mr={3}>
          {title}
        </Box>
      </DialogTitle>
      <Box p={3}>
        <Typography variant="body2">
          {msg}
        </Typography>
      </Box>
    </ModalDialog>
  );
};

export default ConfirmPicker;
