import * as React from 'react';

import ModalDialog from '../ModalDialog';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import DialogTitle from '@material-ui/core/DialogTitle';

interface IConfirmPickerProps {
  onChange: (result: boolean) => void;
  title: string;
  msg: string;
  open?: boolean;
}

export const ConfirmPicker = ({
  onChange = (result: boolean) => console.log({ result }),
  title,
  msg,
  open = true,
}: IConfirmPickerProps) => {
  const handleAccept = () => onChange(true);
  const handleDismis = () => onChange(false);
  return (
    <ModalDialog
      open={open}
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
