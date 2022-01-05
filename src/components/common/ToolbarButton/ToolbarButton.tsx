import * as React from 'react';

import { makeStyles } from "../../../styles";

import Typography from '@mui/material/Typography';

import classNames from '../../../utils/classNames';

const useStyles = makeStyles((theme) => ({
  toolbarBtn: {
    cursor: 'pointer',
    color: theme.palette.text.secondary,
  },
  toolbarBtnSelected: {
    color: theme.palette.text.primary,
  },
}));

export const ToolbarButton = ({
  selected = false,
  className = '',
  label = '',
  ...other
}) => {
  const classes = useStyles();
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
