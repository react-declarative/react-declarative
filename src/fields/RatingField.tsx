import * as React from "react";

import { Box, Typography } from "@material-ui/core";
import { Rating } from '@material-ui/lab';

import makeField from "../components/makeField";

import IManaged, { PickProp } from "../model/IManaged";
import IAnything from "../model/IAnything";
import IField from "../model/IField";

export interface IRatingFieldProps<Data = IAnything> {
  readonly?: PickProp<IField<Data>, "readonly">;
  title?: PickProp<IField<Data>, "title">;
}

interface IRatingFieldPrivate<Data = IAnything> {
  name?: string;
  value: PickProp<IManaged<Data>, "value">;
  disabled: PickProp<IManaged<Data>, "disabled">;
  onChange: PickProp<IManaged<Data>, "onChange">;
}

export const RatingField = ({
  value,
  disabled,
  readonly,
  title,
  name,
  onChange,
}: IRatingFieldProps & IRatingFieldPrivate) => (
  <Box
    display="flex"
    justifyContent="center"
    component="fieldset"
    borderColor="transparent"
  >
    <Typography component="legend">{title}</Typography>
    <Rating
      name={name}
      onChange={({}, v) => onChange(v)}
      disabled={disabled}
      value={Number(value)}
      readOnly={readonly}
    />
  </Box>
);

RatingField.displayName = 'RatingField';

export default makeField(RatingField, {
  skipDebounce: true,
});
