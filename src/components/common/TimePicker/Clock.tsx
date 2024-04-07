import * as React from 'react';

import { makeStyles } from "../../../styles";

import { getMinutes, getHours, MINUTES, HOURS } from './time';

import ClockPointer from './ClockPointer';

/**
 * Function that returns a styles object for a component.
 *
 * @returns The styles object containing the CSS properties for each class name.
 */
const useStyles = makeStyles()({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginTop: 40,
  },
  clock: {
    backgroundColor: 'rgba(0,0,0,.07)',
    borderRadius: '50%',
    height: 260,
    width: 260,
    position: 'relative',
    pointerEvents: 'none',
    userSelect: "none",
    cursor: "pointer",
  },
  squareMask: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    pointerEvents: 'auto',
    touchAction: 'none',
  },
});

const touch = new class {
  private lastOffsetX = 0;
  private lastOffsetY = 0;
  toMouseEvent = ({target, targetTouches}: any) => {
    const {left, top} = target.getBoundingClientRect();
    const {scrollX, scrollY} = window;
    const [touch] = targetTouches;
    if (touch) {
      const {pageX, pageY} = touch;
      this.lastOffsetX = pageX - scrollX - left;
      this.lastOffsetY = pageY - scrollY - top;
    }
    return {
      offsetX: this.lastOffsetX,
      offsetY: this.lastOffsetY,
    };
  };
};

/**
 * Represents the properties for the Clock component.
 */
interface IClockProps {
  type: string;
  value: number;
  children: React.ReactNode[];
  onChange: (value: any) => void;
}

/**
 * Represents a Clock component.
 * @param props - The properties of the Clock component.
 * @param props.type - The type of the clock.
 * @param props.value - The current value of the clock.
 * @param props.children - The child components of the clock.
 * @param props.onChange - The callback function that is called when the value of the clock changes.
 * @returns A React functional component representing the Clock.
 */
export const Clock = ({
  type = '',
  value = 0,
  children,
  onChange = (value: any) => console.log({value}),
}: IClockProps) => {
  const { classes } = useStyles();

  /**
   * Sets the time value based on the given event.
   *
   * @param e - The event object.
   */
  const setTime = (e: any) => {
    const value = type === MINUTES
      ? getMinutes(e.offsetX, e.offsetY)
      : getHours(e.offsetX, e.offsetY);
    onChange(value);
  };

  /**
   * Handles the move event and performs necessary actions.
   *
   * @param e - The event object.
   */
  const handleMove = (e: any) => {
    e.preventDefault();
    if (e.buttons !== 1) { return; }
    setTime(e.nativeEvent);
  };

  /**
   * Handles the touch move event.
   *
   * @param e - The touch move event object.
   * @returns - True if the event is handled successfully, otherwise false.
   */
  const handleTouchMove = (e: any) => {
    e.stopPropagation();
    setTime(touch.toMouseEvent(e));
    return true;
  };

  /**
   * Checks if a selection has been made.
   *
   * @returns Returns true if a selection has been made, false otherwise.
   */
  const hasSelected = () => {
    if (type === HOURS) {
      return true;
    }
    return value % 5 === 0;
  };

  return (
    <div className={classes.container}>
      <div className={classes.clock}>
        <div
          className={classes.squareMask}
          onMouseMove={handleMove}
          onTouchMove={handleTouchMove}
        />
        <ClockPointer
          max={type === HOURS ? 12 : 60}
          hasSelected={hasSelected()}
          value={value}
        />
        { children }
      </div>
    </div>
  );
};

export default Clock;
