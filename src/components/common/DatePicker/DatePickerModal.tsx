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
 * @typedef IDatePickerModalProps
 * @property onChange - Callback function invoked when the selected date changes.
 * @property animateYearScrolling - If true, animates the scrolling between years in the year selection popup. Default is false.
 * @property openToYearSelection - If true, opens the date picker directly to the year selection view. Default is false.
 * @property disableFuture - If true, disables the selection of future dates. Default is false.
 * @property now - The current date. Default is the current date and time.
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
  /**
   * Function to handle change in date.
   * Sets the given date as the new value of the 'date' variable.
   *
   * @param date - The new date value.
   * @returns
   */
  const handleChange = (date: any) => setDate(date);
  /**
   * handleAccept function
   *
   * This function is an event handler that is executed when the date selection is accepted.
   * It calls the onChange function and passes the selected date as an argument.
   *
   * @function handleAccept
   * @returns
   */
  const handleAccept = () => onChange(date);
  /**
   * Handles the dismiss action.
   * Calls the onChange function with null as the argument.
   */
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
