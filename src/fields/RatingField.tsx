import * as React from "react";

import { Box, Typography } from "@material-ui/core";
import { Rating } from '@material-ui/lab';

import makeField from "../components/makeField";
import IManaged, { PickProp } from "../model/IManaged";

export interface IRatingFieldProps {
  value?: PickProp<IManaged, "value">;
  disabled?: PickProp<IManaged, "disabled">;
  readonly?: PickProp<IManaged, "readonly">;
  title?: PickProp<IManaged, "title">;
  onChange?: PickProp<IManaged, "onChange">;
}

export const RatingField = ({
  value,
  disabled,
  readonly,
  title,
  onChange,
}: IManaged) => (
  <Box
    display="flex"
    justifyContent="center"
    component="fieldset"
    borderColor="transparent"
  >
    <Typography component="legend">{title}</Typography>
    <Rating
      onChange={({}, v) => onChange(v)}
      disabled={disabled}
      value={Number(value)}
      readOnly={readonly}
    />
  </Box>
);

export default makeField(RatingField, true);
