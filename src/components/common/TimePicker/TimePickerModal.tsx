import * as React from 'react';
import { useState, useCallback } from 'react';

import dayjs from 'dayjs';

import ModalDialog from '../ModalDialog';
import TimePicker from './TimePicker';

/**
 * Represents the props for the TimePickerModal component.
 */
interface ITimePickerModalProps {
  onChange: (time: dayjs.Dayjs | null) => void;
  now?: dayjs.Dayjs;
  open?: boolean;
}

/**
 * A modal component for picking time.
 *
 * @param props - The component props.
 * @param props.onChange - The function invoked when the time changes. It receives the changed time as an argument.
 * @param props.now - The current time. Defaults to the current time.
 * @param props.open - Whether the modal should be open or not. Defaults to `true`.
 * @returns - The rendered modal component.
 */
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
