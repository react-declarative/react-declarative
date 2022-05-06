import * as React from 'react';
import { useState } from 'react';

import ModalDialog from '../ModalDialog';
import One from '../../One';

import Box from '@mui/material/Box';
import DialogTitle from '@mui/material/DialogTitle';

import IField from '../../../model/IField';
import IAnything from '../../../model/IAnything';
import { OneHandler } from '../../../model/IOneProps';

interface IOnePickerProps<Data = IAnything> {
  onChange: (data: Data | null) => void;
  handler?: OneHandler<Data>;
  title?: string;
  fields: IField[];
  open?: boolean;
}

export const OnePicker = <Data extends IAnything = IAnything>({
  onChange = (data: Data | null) => console.log({ data }),
  fields,
  handler,
  title,
  open = true,
}: IOnePickerProps<Data>) => {
  const [data, setData] = useState<Data | null>(null);
  const handleChange = (data: Data) => setData(data);
  const handleAccept = () => onChange(data);
  const handleDismiss = () => onChange(null);
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
      <Box p={3}>
        <One
          change={handleChange}
          handler={handler}
          fields={fields}
        />
      </Box>
    </ModalDialog>
  );
};

export default OnePicker;
