import * as React from 'react';
import { useState } from 'react';

import dayjs from 'dayjs';

import ModalDialog from '../ModalDialog';
import DatePicker from './DatePicker';

interface IDatePickerModalProps {
  onChange: (time: dayjs.Dayjs | null) => void;
  animateYearScrolling?: boolean;
  openToYearSelection?: boolean;
  disableFuture?: boolean;
  now?: dayjs.Dayjs;
  open?: boolean;
}

export const DatePickerModal = ({
  onChange = (change: any) => console.log({change}),
  animateYearScrolling = false,
  openToYearSelection = false,
  disableFuture = false,
  now = dayjs(),
}: IDatePickerModalProps) => {
  const [date, setDate] = useState(dayjs(now));
  const handleChange = (date: any) => setDate(date);
  const handleAccept = () => onChange(date);
  const handleDismiss = () => onChange(null);
  return (
    <ModalDialog
      open={true}
      onAccept={handleAccept}
      onDismiss={handleDismiss}
    >
      <DatePicker
        date={date}
        onChange={handleChange}
        disableFuture={disableFuture}
        animateYearScrolling={animateYearScrolling}
        openToYearSelection={openToYearSelection}
      />
    </ModalDialog>
  );
};

export default DatePickerModal;
