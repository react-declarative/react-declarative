import * as React from 'react';

import { Theme } from '@mui/material';
import { makeStyles } from '../../../styles';

import classNames from '../../../utils/classNames';

/**
 * An array of positions that represent coordinates on a plane.
 *
 * @type {Array<Array<number>>}
 */
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

/**
 * Defines the styles for the "clockNumber" component.
 *
 * @function useStyles
 * @returns The styles object.
 */
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

/**
 * Represents a clock number component.
 * @param [selected=false] - Indicates if the clock number is selected.
 * @param [label=''] - The label of the clock number.
 * @param [index=0] - The index of the clock number.
 * @param [...otherProps] - Any other props that should be passed to the component.
 * @returns The clock number component.
 */
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
  /**
   * Retrieves the transform style for a given index.
   * @param index - The index of the desired transform style.
   * @returns - The transform style object.
   */
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
