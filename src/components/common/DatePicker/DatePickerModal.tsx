import * as React from 'react';
import { useState } from 'react';

import dayjs from 'dayjs';

import ModalDialog from '../ModalDialog';
import DatePicker from './DatePicker';

export const DatePickerModal = ({
  onChange = (change: any) => console.log({change}),
  animateYearScrolling = false,
  openToYearSelection = false,
  disableFuture = false,
  now = dayjs(),
}) => {
  const [date, setDate] = useState(dayjs(now));
  const handleChange = (date: any) => setDate(date);
  const handleAccept = () => onChange(date);
  const handleDismis = () => onChange(null);
  return (
    <ModalDialog
      open={true}
      onAccept={handleAccept}
      onDismis={handleDismis}
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
