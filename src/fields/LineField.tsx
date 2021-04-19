import * as React from 'react';

import { Box, makeStyles, Typography } from '@material-ui/core';

import makeField from "../components/makeField";

import { PickProp } from '../model/IManaged';
import IAnything from '../model/IAnything';
import IField from '../model/IField';

const useStyles = makeStyles((theme) => ({
  root: {
    height: 72,
    display: 'flex',
    flexWrap: 'nowrap',
    whiteSpace: 'nowrap',
    alignItems: 'center',
    justifyContent: 'stretch',
  },
  line: {
    background: theme.palette.text.secondary,
    flexGrow: 1,
    margin: 15,
    height: 1,
  }
}));

export interface ILineFieldProps<Data = IAnything> {
  title?: PickProp<IField<Data>, 'title'>;
}

export const LineField = ({
  title = '',
}: ILineFieldProps) => {
  const classes = useStyles();
  return (
    <Box className={classes.root}>
      <Typography variant="h5">{title}</Typography>
      <Box className={classes.line}></Box>
    </Box>
  );
};

LineField.displayName = 'LineField';

export default makeField(LineField, false);
