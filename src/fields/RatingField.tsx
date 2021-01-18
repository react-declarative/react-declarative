import * as React from "react";

import { Box, Typography } from "@material-ui/core";
import { Rating } from '@material-ui/lab';

import makeField from "../components/makeField";
import IManaged, { PickProp } from "../model/IManaged";
import IField from "../model/IField";

export interface IRatingFieldProps {
  readonly?: PickProp<IField, "readonly">;
  title?: PickProp<IField, "title">;
}

interface IRatingFieldPrivate {
  name?: string;
  value: PickProp<IManaged, "value">;
  disabled: PickProp<IManaged, "disabled">;
  onChange: PickProp<IManaged, "onChange">;
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

export default makeField(RatingField, true);
