import * as React from 'react';

import ModalDialog from '../ModalDialog';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';

/**
 * Interface for the ConfirmPicker component props.
 */
interface IConfirmPickerProps {
  onChange: (result: boolean) => void;
  title: string;
  msg: string;
  open?: boolean;
  canCancel?: boolean;
}

/**
 * Represents a Confirmation Picker component.
 * @param props - The properties of the ConfirmPicker component.
 * @param props.onChange - The callback function when the picker value changes.
 * @param props.canCancel - Specifies if the picker can be cancelled.
 * @param props.title - The title of the picker.
 * @param props.msg - The message displayed in the picker.
 * @param props.open - Specifies if the picker is open.
 * @returns - The ConfirmPicker component.
 */
export const ConfirmPicker = ({
  onChange = (result: boolean) => console.log({ result }),
  canCancel = true,
  title,
  msg,
  open = true,
}: IConfirmPickerProps) => {
  /**
   * Callback function to handle an accept event.
   * Calls the `onChange` function with `true` as the argument.
   */
  const handleAccept = () => onChange(true);
  /**
   * Handles dismissing by calling the provided onChange function with false.
   */
  const handleDismiss = () => onChange(false);

  return (
    <ModalDialog
      open={open}
      canCancel={canCancel}
      onAccept={handleAccept}
      onDismiss={handleDismiss}
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
