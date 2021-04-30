import * as React from "react";

import { Box, Radio, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";

import makeField from "../components/makeField";

import IField from "../model/IField";
import IAnything from "../model/IAnything";
import IManaged, { PickProp } from "../model/IManaged";

import { useRegistry } from "../helpers/RadioHelper";

export interface IRadioFieldProps<Data = IAnything> {
  title?: PickProp<IField<Data>, "title">;
  radioValue?: PickProp<IField<Data>, "radioValue">;
}

interface IRadioFieldPrivate<Data = IAnything> {
  disabled: PickProp<IManaged<Data>, "disabled">;
  value: PickProp<IManaged<Data>, "value">;
  onChange: PickProp<IManaged<Data>, "onChange">;
  name?: PickProp<IManaged<Data>, 'name'>;
}

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  }
});

export const RadioField = ({
  disabled,
  onChange,
  radioValue,
  title,
  name,
}: IRadioFieldProps & IRadioFieldPrivate) => {
  const [read, write] = useRegistry(name!);
  const classes = useStyles();

  const handleChange = () => {
    if (name === 'radioButton2') {
      debugger;
    }
    onChange(radioValue);
    write(radioValue!);
  };

  return (
    <Box className={classes.root} onClick={handleChange}>
      <Radio checked={read() === radioValue} disabled={disabled} />
      <Typography variant="body1">
        {title}
      </Typography>
    </Box>
  );
};

RadioField.displayName = 'RadioField';

export default makeField(RadioField, {
  skipValueSnapshot: true,
});
