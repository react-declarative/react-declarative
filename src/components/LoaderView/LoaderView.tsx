import * as React from "react";
import { useEffect } from "react";

import { makeStyles } from "../../styles";

import Box, { BoxProps } from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

import classNames from "../../utils/classNames";

/**
 * Interface for the props of the LoaderView component.
 *
 * @interface ILoaderViewProps
 * @extends BoxProps
 */
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
  variant?: "determinate" | "indeterminate";
  value?: number;
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
 * @param ILoaderViewProps - The props for the LoaderView component.
 * @param ILoaderViewProps.className - The class name for the component.
 * @param ILoaderViewProps.onLoadStart - The callback function to be called when loading starts.
 * @param ILoaderViewProps.onLoadEnd - The callback function to be called when loading ends.
 * @param ILoaderViewProps.handler - The asynchronous function to handle the loading logic.
 * @param ILoaderViewProps.fallback - The fallback function to handle errors in loading.
 * @param ILoaderViewProps.throwError - Indicates if the error should be thrown or handled by the fallback function.
 * @param ILoaderViewProps.size - The size of the circular progress spinner.
 * @param ILoaderViewProps.sx - Custom styling for the component.
 * @param otherProps - Any additional props to be passed to the component.
 *
 * @returns The rendered LoaderView component.
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
  variant,
  value,
  ...otherProps
}: ILoaderViewProps) => {
  const { classes } = useStyles();

  useEffect(() => {
    if (!handler) {
      return;
    }
    /**
     * Executes a process asynchronously.
     *
     * @async
     * @function process
     * @returns A promise that resolves when the process is complete.
     * @throws If an error occurs and `throwError` is set to `true`.
     */
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
      <CircularProgress variant={variant} value={value} size={size} />
    </Box>
  );
};

LoaderView.createLoader = (size: number) => () => <LoaderView size={size} />;

export default LoaderView;
