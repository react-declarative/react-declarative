import * as React from 'react';
import { useCallback } from 'react';

import { makeStyles } from "../../../styles";

import classNames from '../../../utils/classNames';

/**
 * Returns the styles object for a component using the makeStyles function with the provided theme.
 *
 * @param theme - The theme object used for styling the component.
 * @returns - The styles object.
 */
const useStyles = makeStyles()((theme) => ({
  pointer: {
    width: 2,
    backgroundColor: theme.palette.primary.main,
    height: '40%',
    position: 'absolute',
    left: 'calc(50% - 1px)',
    bottom: '50%',
    transformOrigin: 'center bottom 0px',
  },
  thumb: {
    width: 4,
    height: 4,
    backgroundColor: theme.palette.primary.main,
    borderRadius: '100%',
    position: 'absolute',
    top: -21,
    left: -15,
    border: `14px solid ${theme.palette.primary.main}`,
    boxSizing: 'content-box',
  },
  noPoint: {
    backgroundColor: theme.palette.primary.main,
  },
}));

/**
 * ClockPointer represents a clock hand that can be displayed on a clock face.
 *
 * @param props - Configuration options for the ClockPointer.
 * @param props.hasSelected - Indicates whether the ClockPointer is selected.
 * @param props.value - The current value of the ClockPointer.
 * @param props.max - The maximum value for the ClockPointer.
 * @returns - JSX element representing the ClockPointer.
 */
export const ClockPointer = ({
  hasSelected = false,
  value = 0,
  max = 0,
}) => {
  const { classes } = useStyles();
  /**
   * Returns the CSS style for rotating an element based on the angle calculated from value and max.
   * @returns The CSS transform style object.
   */
  const getAngleStyle = useCallback(() => {
    const angle = (360 / max) * value;
    return {
      transform: `rotateZ(${angle}deg)`,
    };
  }, [value, max]);
  return (
    <div
      className={classes.pointer}
      style={getAngleStyle()}
    >
      <div className={classNames(classes.thumb, { [classes.noPoint]: hasSelected })} />
    </div>
  );
};

export default ClockPointer;
