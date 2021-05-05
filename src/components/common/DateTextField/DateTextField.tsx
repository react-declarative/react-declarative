import * as React from 'react';

import TextField, { TextFieldProps } from '@material-ui/core/TextField';

import dayjs from 'dayjs';

type IDateTextFieldProps = TextFieldProps & {
  onChange: (change: any) => void;
  format: string;
  value: string;
}

export const DateTextField = ({
  onChange = (change: any) => console.log({change}),
  format = '',
  value = '',
  ...other
}: IDateTextFieldProps) => {
  const getDisplayDate = () => dayjs(value).format(format);
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
