import * as React from 'react';

import { makeStyles } from "../../../styles";

import Typography from '@mui/material/Typography';

import classNames from '../../../utils/classNames';

/**
 * This variable `useStyles` is used to generate styles for a component using the `makeStyles` function
 *
 * @typedef Styles - The generated styles object with CSS class names as keys and corresponding styles as values
 * @property toolbarBtn - The CSS class for toolbar button with cursor pointer and secondary text color
 * @property toolbarBtnSelected - The CSS class for selected toolbar button with primary text color
 *
 * @param theme - The theme object containing the palette with color definitions
 * @returns - The object containing the generated CSS class names and styles
 */
const useStyles = makeStyles()((theme) => ({
  toolbarBtn: {
    cursor: 'pointer',
    color: theme.palette.text.secondary,
  },
  toolbarBtnSelected: {
    color: theme.palette.text.primary,
  },
}));

/**
 * Represents a toolbar button component.
 *
 * @typedef ToolbarButton
 * @param selected - Sets the selected state of the button. Default is false.
 * @param className - Additional classes to apply to the button.
 * @param label - The text label to display on the button.
 * @param other - Additional props to pass to the Typography component.
 * @returns - The rendered toolbar button.
 *
 */
export const ToolbarButton = ({
  selected = false,
  className = '',
  label = '',
  ...other
}) => {
  const { classes } = useStyles();
  return (
    <Typography
      className={classNames(classes.toolbarBtn, className, {
        [classes.toolbarBtnSelected]: selected,
      })}
      {...other}
    >
      { label }
    </Typography>
  );
};

export default ToolbarButton;
