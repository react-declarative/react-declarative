import * as React from "react";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";

import { makeStyles } from "../../styles";

import Box, { BoxProps } from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import AccessTimeIcon from "@mui/icons-material/AccessTime";

import useActualCallback from "../../hooks/useActualCallback";
import classNames from "../../utils/classNames";

/**
 * Interface for the Countdown component props.
 */
export interface ICountdownProps extends BoxProps {
  children?: React.ReactNode;
  expireAt: string | number | Date;
  onExpire?: () => void;
}

/**
 * The `useStyles` variable is a custom hook that generates a set of CSS styles
 * using the `makeStyles` function provided by the Material-UI library.
 *
 * @returns {Object} - An object that contains the generated CSS styles.
 */
const useStyles = makeStyles()((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing(1),
  },
}));

/**
 * Countdown component displays a countdown timer that expires at a given time.
 *
 * @typedef  ICountdownProps
 * @property className - The CSS class name for styling the component.
 * @} children - The content to be displayed inside the countdown component.
 * @property expireAt - The time at which the countdown expires.
 * @property onExpire - The callback function to be called when the countdown expires.
 * @property otherProps - Additional props to be spread onto the root element.
 *
 * @param props - The countdown component props.
 * @returns - The countdown component.
 */
export const Countdown = ({
  className,
  children,
  expireAt,
  onExpire = () => undefined,
  ...otherProps
}: ICountdownProps) => {
  const { classes } = useStyles();

  const [count, setCount] = useState<number>();
  const intervalRef = useRef<number>();

  const onExpire$ = useActualCallback(onExpire);

  /**
   * Represents the timeout value.
   *
   * @typedef {Date} Timeout
   */
  const timeout = useMemo(() => {
    const date = new Date(expireAt);
    return new Date(+date - Date.now());
  }, [count]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCount(Date.now());
    });
    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (+timeout < 0) {
      onExpire$();
      clearInterval(intervalRef.current);
    }
  }, [timeout]);

  /**
   * Renders the inner content based on the given timeout value. If the timeout is negative, it will render the children if available, otherwise it will render a default content. If the
   * timeout is non-negative, it will render the time value based on the minutes and seconds of the timeout.
   *
   * @returns {JSX.Element} The rendered inner content.
   */
  const renderInner = useCallback(() => {
    if (+timeout < 0) {
      return children ? (
        <>{children}</>
      ) : (
        <>
          <AccessTimeIcon />
          <Typography variant="body1">00:00</Typography>
        </>
      );
    }
    return (
      <>
        <AccessTimeIcon />
        <Typography variant="body1">
          {timeout.getMinutes().toString().padStart(2, "0")}:
          {timeout.getSeconds().toString().padStart(2, "0")}
        </Typography>
      </>
    );
  }, [timeout, children]);

  return (
    <Box className={classNames(classes.root, className)} {...otherProps}>
      <Box className={classes.container}>{renderInner()}</Box>
    </Box>
  );
};

export default Countdown;
