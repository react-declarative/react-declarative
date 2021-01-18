import * as React from "react";

import { Box, LinearProgress, Typography } from "@material-ui/core";

import makeField from "../components/makeField";
import IManaged, { PickProp } from "../model/IManaged";
import IField from "../model/IField";

const percent = (v: number, m: number) => Math.min(100, Math.round((Math.max(Number(v), 0) / m) * 100));

export interface IProgressFieldProps {
  maxPercent?: PickProp<IField, "maxPercent">;
  showPercentLabel?: PickProp<IField, "showPercentLabel">;
}

interface IProgressFieldPrivate {
  value: PickProp<IManaged, "value">;
}

export const ProgressField = ({
  maxPercent = 1.0,
  showPercentLabel,
  value,
}: IProgressFieldProps & IProgressFieldPrivate) => (
  <Box display="flex" alignItems="center">
    <Box width="100%" mr={1}>
      <LinearProgress
        value={percent(Number(value), Number(maxPercent))}
      />
    </Box>
    {showPercentLabel && (
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">
          {`${percent(Number(value), Number(maxPercent))}%`}
        </Typography>
      </Box>
    )}
  </Box>
);

export default makeField(ProgressField, false);
