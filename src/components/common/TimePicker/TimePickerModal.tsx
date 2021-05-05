import * as React from 'react';
import { useState, useCallback } from 'react';

import dayjs from 'dayjs';

import ModalDialog from '../ModalDialog';
import TimePicker from './TimePicker';

export const TimePickerModal = ({
  onChange = (change: any) => console.log({change}),
  now = dayjs(),
}) => {
  const [time, setTime] = useState(now);
  const handleChange = (time: any) => setTime(time);
  const handleAccept = useCallback(() => onChange(time), [time]);
  const handleDismis = () => onChange(null);
  return (
    <ModalDialog
      open={true}
      onAccept={handleAccept}
      onDismis={handleDismis}
    >
      <TimePicker
        date={time}
        onChange={handleChange}
      />
    </ModalDialog>
  );
};

export default TimePickerModal;
