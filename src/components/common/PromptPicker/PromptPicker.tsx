import * as React from 'react';
import { useState, useEffect } from 'react';

import ModalDialog from '../ModalDialog';

import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import DialogTitle from '@mui/material/DialogTitle';

interface IPromptPickerProps {
  onChange: (result: string | null) => void;
  title: string;
  value: string;
  placeholder: string;
  open?: boolean;
  canCancel?: boolean;
}

export const PromptPicker = ({
  onChange = (result) => console.log({ result }),
  canCancel = true,
  title,
  value: defaultValue,
  placeholder,
  open = true,
}: IPromptPickerProps) => {
  const [value, setValue] = useState(defaultValue);
  useEffect(() => setValue(defaultValue), [defaultValue]);
  const handleAccept = () => onChange(value);
  const handleDismiss = () => onChange(null);
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
        <InputBase
          sx={{ width: '100%' }}
          placeholder={placeholder}
          onChange={({ target }) => setValue(target.value)}
        />
      </Box>
    </ModalDialog>
  );
};

export default PromptPicker;
