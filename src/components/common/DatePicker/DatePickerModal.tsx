import * as React from 'react';
import { useState } from 'react';

import dayjs from 'dayjs';

import ModalDialog from '../ModalDialog';
import DatePicker from './DatePicker';

/**
 * Represents the props for the DatePickerModal component.
 */
interface IDatePickerModalProps {
  onChange: (time: dayjs.Dayjs | null) => void;
  animateYearScrolling?: boolean;
  openToYearSelection?: boolean;
  disableFuture?: boolean;
  now?: dayjs.Dayjs;
  open?: boolean;
}

/**
 * A modal component that displays a date picker.
 *
 * @typedef {object} IDatePickerModalProps
 * @property {function} onChange - Callback function invoked when the selected date changes.
 * @property {boolean} animateYearScrolling - If true, animates the scrolling between years in the year selection popup. Default is false.
 * @property {boolean} openToYearSelection - If true, opens the date picker directly to the year selection view. Default is false.
 * @property {boolean} disableFuture - If true, disables the selection of future dates. Default is false.
 * @property {object} now - The current date. Default is the current date and time.
 *
 * @param props - The props object containing the configuration options for the date picker modal.
 * @returns - The rendered modal dialog component.
 */
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
