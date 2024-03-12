import * as React from "react";
import { useEffect } from "react";

import { makeStyles } from "../../styles";

import Box, { BoxProps } from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

import classNames from "../../utils/classNames";

interface ILoaderViewProps
  extends Omit<
    BoxProps,
    keyof {
      children: never;
    }
  > {
  onLoadStart?: () => void;
  onLoadEnd?: (isOk: boolean) => void;
  handler?: () => Promise<void> | void;
  fallback?: (e: Error) => void;
  throwError?: boolean;
  size?: number | string;
}

const useStyles = makeStyles()({
  root: {
    display: "flex",
    overflow: "hidden",
  },
});

/**
 * Represents a loader view component.
 *
 * @param {Object} ILoaderViewProps - The props for the LoaderView component.
 * @param {string} ILoaderViewProps.className - The class name for the component.
 * @param {function} ILoaderViewProps.onLoadStart - The callback function to be called when loading starts.
 * @param {function} ILoaderViewProps.onLoadEnd - The callback function to be called when loading ends.
 * @param {function} ILoaderViewProps.handler - The asynchronous function to handle the loading logic.
 * @param {function} ILoaderViewProps.fallback - The fallback function to handle errors in loading.
 * @param {boolean} ILoaderViewProps.throwError - Indicates if the error should be thrown or handled by the fallback function.
 * @param {number} ILoaderViewProps.size - The size of the circular progress spinner.
 * @param {Object} ILoaderViewProps.sx - Custom styling for the component.
 * @param {Object} otherProps - Any additional props to be passed to the component.
 *
 * @returns {JSX.Element} The rendered LoaderView component.
 */
export const LoaderView = ({
  className,
  onLoadStart,
  onLoadEnd,
  handler,
  fallback,
  throwError,
  size,
  sx,
  ...otherProps
}: ILoaderViewProps) => {
  const { classes } = useStyles();

  useEffect(() => {
    if (!handler) {
      return;
    }
    const process = async () => {
      let isOk = true;
      try {
        onLoadStart && onLoadStart();
        await handler();
      } catch (e: any) {
        isOk = false;
        if (!throwError) {
          fallback && fallback(e as Error);
        } else {
          throw e;
        }
      } finally {
        onLoadEnd && onLoadEnd(isOk);
      }
    };
    process();
  }, []);

  return (
    <Box
      className={classNames(className, classes.root)}
      sx={{
        alignItems: "center",
        justifyContent: "center",
        ...sx,
      }}
      {...otherProps}
    >
      <CircularProgress size={size} />
    </Box>
  );
};

LoaderView.createLoader = (size: number) => () => <LoaderView size={size} />;

export default LoaderView;
