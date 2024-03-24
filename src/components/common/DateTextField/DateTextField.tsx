import * as React from 'react';

import TextField, { TextFieldProps } from '@mui/material/TextField';

import dayjs from 'dayjs';

/**
 * Interface representing the properties for the DateTextField component.
 * @interface
 */
type IDateTextFieldProps = TextFieldProps & {
  onChange: (change: any) => void;
  format: string;
  value: string;
}

/**
 * Represents a DateTextField component used for displaying and selecting dates in a text field.
 *
 * @param props - The props for the DateTextField component.
 * @param props.onChange - The function to call when the date value changes.
 * @param [props.format=""] - The format of the displayed date. Uses the formatting syntax of the dayjs library.
 * @param [props.value=""] - The initial value of the date.
 * @param [props.other] - Additional props to pass to the underlying TextField component.
 * @returns The rendered DateTextField component.
 */
export const DateTextField = ({
  onChange = (change: any) => console.log({change}),
  format = '',
  value = '',
  ...other
}: IDateTextFieldProps) => {
  /**
   * Retrieves the formatted display date based on the provided value and format.
   *
   * @returns The formatted display date.
   */
  const getDisplayDate = () => dayjs(value).format(format);
  /**
   * Handles change event for input fields.
   *
   * @param e - The change event object.
   */
  const handleChange = (e: any) => {
    const {target} = e;
    const {value} = target;
    const momentValue = dayjs(value);
    if (momentValue.isValid()) {
      onChange(momentValue);
    }
  };
  return (
    <TextField
      value={getDisplayDate()}
      onChange={handleChange}
      {...other}
    />
  );
};

export default DateTextField;
