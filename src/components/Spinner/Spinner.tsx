import * as React from "react";

import { makeStyles, keyframes, useTheme } from "../../styles";

import Box, { BoxProps } from "@mui/material/Box";

import classNames from "../../utils/classNames";

interface ISpinnerProps extends Omit<BoxProps, keyof {
  children: never;
}> {}

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
 * @param {Object} props - The props object for the spinner component.
 * @param {string} props.className - The custom CSS class name for the spinner component.
 * @param {Object} props.otherProps - The additional props to be spread on the root Box element.
 *
 * @returns {JSX.Element} The spinner component.
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
