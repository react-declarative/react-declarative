import * as React from "react";
import { forwardRef } from 'react';

import { makeStyles } from "../../styles";
import { alpha } from "@mui/material";

import Paper, { PaperProps } from "@mui/material/Paper";
import Box from "@mui/material/Box";

import classNames from "../../utils/classNames";

const useStyles = makeStyles()((theme) => ({
  outline: {
    border: `1px solid ${alpha(
      theme.palette.getContrastText(theme.palette.background.default),
      0.23
    )}`,
    background: theme.palette.background.paper,
    borderRadius: "4px",
  },
}));

interface IPaperViewProps extends Omit<PaperProps, keyof {
  component: never;
}> {
  outlinePaper?: boolean;
}

export const PaperView = forwardRef(({
  className,
  outlinePaper,
  ...otherProps
}: IPaperViewProps, ref: React.Ref<HTMLDivElement>) => {
  const { classes } = useStyles();
  if (outlinePaper) {
    return (
      <Box className={classNames(className, classes.outline)} {...otherProps} ref={ref}  />
    );
  }
  return <Paper className={className} {...otherProps} ref={ref} />;
});

export default PaperView;