import * as React from 'react';

import { Theme } from '@mui/material';
import { makeStyles } from '../../../styles';

import classNames from '../../../utils/classNames';

const positions = [
  [0, 5],
  [55, 19.6],
  [94.4, 59.5],
  [109, 114],
  [94.4, 168.5],
  [54.5, 208.4],
  [0, 223],
  [-54.5, 208.4],
  [-94.4, 168.5],
  [-109, 114],
  [-94.4, 59.5],
  [-54.5, 19.6],
];

const useStyles = makeStyles()((theme: Theme) => ({
  clockNumber: {
    width: 32,
    height: 32,
    position: 'absolute',
    left: 'calc(50% - 16px)',
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '50%',
    pointerEvents: 'all',
    color: theme.palette.text.primary,
  },
  selected: {
    color: theme.palette.getContrastText(theme.palette.text.primary)
  },
}));

export const ClockNumber = ({
  selected = false,
  label = '',
  index = 0,
  ...otherProps
}) => {
  const { classes } = useStyles();
  const className = classNames(classes.clockNumber, {
    [classes.selected]: selected,
  });
  const getTransformStyle = (index: number) => {
    const position = positions[index];
    return {
      transform: `translate(${position[0]}px, ${position[1]}px`,
    };
  };
  return (
    <div
      className={className}
      style={getTransformStyle(index)}
      {...otherProps}
    >
      { label }
    </div>
  );
};

export default ClockNumber;
