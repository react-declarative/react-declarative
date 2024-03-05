import * as React from "react";
import { forwardRef } from 'react';

import { makeStyles } from "../../styles";
import { alpha } from "@mui/material";

import Paper, { PaperProps } from "@mui/material/Paper";
import Box from "@mui/material/Box";

import classNames from "../../utils/classNames";

export const PAPERVIEW_ROOT = 'react-declatative__PaperView-root';

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
  transparent?: boolean;
}

export const PaperView = forwardRef(({
  className,
  outlinePaper,
  transparent,
  ...otherProps
}: IPaperViewProps, ref: React.Ref<HTMLDivElement>) => {
  const { classes } = useStyles();
  if (transparent) {
    return (
      <Box className={classNames(className, PAPERVIEW_ROOT)} {...otherProps} ref={ref}  />
    );
  }
  if (outlinePaper) {
    return (
      <Box className={classNames(className, classes.outline, PAPERVIEW_ROOT)} {...otherProps} ref={ref}  />
    );
  }
  return <Paper className={classNames(className, PAPERVIEW_ROOT)} {...otherProps} ref={ref} />;
});

export default PaperView;
