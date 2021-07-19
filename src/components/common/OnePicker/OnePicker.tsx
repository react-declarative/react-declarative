import * as React from 'react';
import { useState } from 'react';

import ModalDialog from '../ModalDialog';
import One from '../../One';

import IField from '../../../model/IField';
import IAnything from '../../../model/IAnything';
import { OneHandler } from '../../../model/IOneProps';

import Box from '@material-ui/core/Box';
import DialogTitle from '@material-ui/core/DialogTitle';

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
  const handleChange = (data: Data, initial: boolean) => !initial && setData(data);
  const handleAccept = () => onChange(data);
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
