import * as React from 'react';
import { useState } from 'react';

import ModalDialog from '../ModalDialog';
import One from '../../One';

import Box from '@mui/material/Box';
import DialogTitle from '@mui/material/DialogTitle';

import useActualValue from "../../../hooks/useActualValue";
import useRenderWaiter from "../../../hooks/useRenderWaiter";

import IField from '../../../model/IField';
import IAnything from '../../../model/IAnything';
import IOneProps, { OneHandler } from '../../../model/IOneProps';
import IOnePublicProps from '../../../model/IOnePublicProps';

import sleep from '../../../utils/sleep';

interface IOnePickerProps<Data = IAnything, Payload = IAnything> {
  waitForChangesDelay?: number;
  large?: boolean;
  onChange: (data: Data | null) => void;
  handler?: OneHandler<Data, Payload>;
  payload?: IOneProps<Data, Payload>['payload'];
  features?: IOnePublicProps<Data, Payload>['features'];
  title?: string;
  fields: IField[];
  open?: boolean;
}

const WAIT_FOR_CHANGES_DELAY = 1_000;

export const OnePicker = <Data extends IAnything = IAnything, Payload = IAnything>({
  waitForChangesDelay = WAIT_FOR_CHANGES_DELAY,
  onChange = (data: Data | null) => console.log({ data }),
  fields,
  handler,
  payload,
  features,
  large,
  title,
  open = true,
}: IOnePickerProps<Data, Payload>) => {
  const [data, setData] = useState<Data | null>(null);
  const [disabled, setDisabled] = useState(false);
  const [invalid, setInvalid] = useState(false);

  const data$ = useActualValue(data);

  const waitForRender = useRenderWaiter([data], 10);

  const waitForChanges = async () => {
    await Promise.race([
      waitForRender(),
      sleep(waitForChangesDelay),
    ]);
  };

  const handleChange = (data: Data) => {
    setData(data);
    setInvalid(false);
  };
  const handleInvalid = () => setInvalid(true);
  const handleDismiss = () => onChange(null);

  const handleAccept = async () => {
    setDisabled(true);
    try {
      await waitForChanges();
      onChange(data$.current);
    } finally {
      setDisabled(false);
    }
  };

  return (
    <ModalDialog
      open={open}
      disabled={disabled}
      invalid={!data || invalid}
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
      <Box sx={{ width: large ? '100vw' : 'unset' }} p={3}>
        <One
          change={handleChange}
          invalidity={handleInvalid}
          handler={handler}
          payload={payload}
          fields={fields}
          features={features}
        />
      </Box>
    </ModalDialog>
  );
};

export default OnePicker;
