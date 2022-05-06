import * as React from 'react';
import { useState, useCallback } from 'react';

import dayjs from 'dayjs';

import ModalDialog from '../ModalDialog';
import TimePicker from './TimePicker';

interface ITimePickerModalProps {
  onChange: (time: dayjs.Dayjs | null) => void;
  now?: dayjs.Dayjs;
  open?: boolean;
}

export const TimePickerModal = ({
  onChange = (change: any) => console.log({change}),
  now = dayjs(),
  open = true,
}: ITimePickerModalProps) => {
  const [time, setTime] = useState(now);
  const handleChange = (time: any) => setTime(time);
  const handleAccept = useCallback(() => onChange(time), [time]);
  const handleDismiss = () => onChange(null);
  return (
    <ModalDialog
      open={open}
      onAccept={handleAccept}
      onDismiss={handleDismiss}
    >
      <TimePicker
        date={time}
        onChange={handleChange}
      />
    </ModalDialog>
  );
};

export default TimePickerModal;
