import * as React from "react";
import { forwardRef } from 'react';

import { makeStyles } from "../../styles";
import { alpha } from "@mui/material";

import Paper, { PaperProps } from "@mui/material/Paper";
import Box from "@mui/material/Box";

import classNames from "../../utils/classNames";

export const PAPERVIEW_ROOT = 'react-declatative__PaperView-root';

/**
 * Creates a custom set of styles using the makeStyles hook from Material-UI.
 * The returned styles object provides CSS classes for the outlined element.
 *
 * @param {Object} theme - The theme object from Material-UI.
 * @returns {Object} - An object containing CSS classes for the outlined element.
 */
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

/**
 * Interface representing the props for the PaperView component.
 *
 * @interface IPaperViewProps
 */
interface IPaperViewProps extends Omit<PaperProps, keyof {
  component: never;
}> {
  outlinePaper?: boolean;
  transparentPaper?: boolean;
}

/**
 * React component for rendering a customizable paper view.
 *
 * @component
 * @param  props - The component props.
 * @param props.className - The CSS class name for the paper view.
 * @param props.outlinePaper - Specifies whether the paper view should have an outline.
 * @param props.transparentPaper - Specifies whether the paper view should be transparent.
 * @param {React.Ref} ref - The ref to be forwarded to the underlying HTML element.
 * @returns {React.Element} The rendered paper view component.
 */
export const PaperView = forwardRef(({
  className,
  outlinePaper,
  transparentPaper,
  ...otherProps
}: IPaperViewProps, ref: React.Ref<HTMLDivElement>) => {
  const { classes } = useStyles();
  if (transparentPaper) {
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
