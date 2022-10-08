import * as React from 'react';
import { useCallback } from 'react';

import { makeStyles } from "../../../styles";

import classNames from '../../../utils/classNames';

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

export const ClockPointer = ({
  hasSelected = false,
  value = 0,
  max = 0,
}) => {
  const { classes } = useStyles();
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
