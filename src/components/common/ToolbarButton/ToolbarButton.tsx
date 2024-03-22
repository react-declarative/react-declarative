import * as React from 'react';

import { makeStyles } from "../../../styles";

import Typography from '@mui/material/Typography';

import classNames from '../../../utils/classNames';

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
 * @typedef {Object} ToolbarButton
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
