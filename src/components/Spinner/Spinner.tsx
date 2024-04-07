import * as React from "react";

import { makeStyles, keyframes, useTheme } from "../../styles";

import Box, { BoxProps } from "@mui/material/Box";

import classNames from "../../utils/classNames";

/**
 * The `ISpinnerProps` interface represents the properties of the Spinner component.
 * It extends the `BoxProps` interface and excludes the `children` property.
 */
interface ISpinnerProps extends Omit<BoxProps, keyof {
  children: never;
}> {}

/**
 * Represents a function that creates a spin animation.
 * @param [ms=1000] - The duration in milliseconds for the animation.
 * @returns - An object representing the spin animation.
 * @property transformBox - The value for the `transformBox` CSS property.
 * @property transformOrigin - The value for the `transformOrigin` CSS property.
 * @property animation - The CSS animation property with keyframes and duration.
 */
const createSpin = (ms = 1_000) => ({
  transformBox: 'fill-box',
  transformOrigin: 'center',
  animation: `${keyframes`
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  `} ${ms}ms infinite linear`,
} as const);

/**
 * The useStyles variable is created using the makeStyles() function, which is a hook in the Material-UI library.
 * It is used to define and generate custom styles for a component.
 *
 * @typedef {Object} Classes
 * @property root - The class name for the root element of the component
 * @property spin1 - The class name for the spin1 element of the component
 * @property spin2 - The class name for the spin2 element of the component
 * @property spin3 - The class name for the spin3 element of the component
 * @property spin4 - The class name for the spin4 element of the component
 *
 * @typedef {Object} StyleFn
 * @param theme - The theme object provided by Material-UI
 * @returns - An object containing the class names for the different elements of the component
 *
 * @function createSpin
 * @param duration - The duration of the spin animation, in milliseconds
 * @returns - The class name for the spin animation
 *
 * @function makeStyles
 * @param styles - The function that generates the styles for the component
 * @returns - An object containing the class names for the different elements of the component
 *
 * @description
 * The useStyles variable is a function call to the makeStyles() hook, passing in an object
 * that defines the styles for different elements of the component.
 *
 * The `root` property defines the styles for the root element of the component which includes
 * display, alignItems, justifyContent, minHeight, and minWidth properties.
 *
 * The `spin1`, `spin2`, `spin3`, and `spin4` properties use the createSpin function to generate
 * class names for spin animations with different durations.
 *
 * The useStyles variable returns an object with class names for each element, which can be used
 * to apply the custom styles to the respective elements in the component.
 *
 */
const useStyles = makeStyles()({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 315,
    minWidth: 315,
  },
  spin1: createSpin(1_000),
  spin2: createSpin(1_500),
  spin3: createSpin(2_500),
  spin4: createSpin(2_000),
});

/**
 * Represents a spinner component that displays a loading animation.
 * @component
 *
 * @param props - The props object for the spinner component.
 * @param props.className - The custom CSS class name for the spinner component.
 * @param props.otherProps - The additional props to be spread on the root Box element.
 *
 * @returns The spinner component.
 */
export const Spinner = ({ className, ...otherProps }: ISpinnerProps) => {
  const { classes } = useStyles();
  const theme = useTheme();
  const color = theme.palette.mode === 'light' ? theme.palette.primary.main : '#fff';
  return (
    <Box className={classNames(className, classes.root)} {...otherProps}>
      <svg width={315} height={315} viewBox="-25 -25 400 400">
        <circle
          className={classes.spin4}
          stroke={color}
          transform="rotate(-90 175 175)"
          cx={175}
          cy={175}
          r={105}
          strokeDasharray={1100}
          strokeWidth={10}
          strokeDashoffset={605}
          strokeLinecap="round"
          fill="none"
        />
        <circle
          className={classes.spin3}
          stroke={color}
          transform="rotate(-90 175 175)"
          cx={175}
          cy={175}
          r={130}
          strokeDasharray={1100}
          strokeWidth={10}
          strokeDashoffset={605}
          strokeLinecap="round"
          fill="none"
        />
        <circle
          className={classes.spin2}
          stroke={color}
          transform="rotate(-90 175 175)"
          cx={175}
          cy={175}
          r={155}
          strokeDasharray={1100}
          strokeWidth={10}
          strokeDashoffset={605}
          strokeLinecap="round"
          fill="none"
        />
        <circle
          className={classes.spin1}
          stroke={color}
          transform="rotate(-90 175 175)"
          cx={175}
          cy={175}
          r={175}
          strokeDasharray={1100}
          strokeWidth={10}
          strokeDashoffset={605}
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </Box>
  );
};

export default Spinner;
