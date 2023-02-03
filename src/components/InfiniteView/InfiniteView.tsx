import * as React from "react";
import { useRef, useCallback, useState, useLayoutEffect } from "react";

import { makeStyles } from "../../styles";

import Box, { BoxProps } from "@mui/material/Box";
import { SxProps } from "@mui/system";

import useActualCallback from "../../hooks/useActualCallback";
import classNames from "../../utils/classNames";

interface IInfiniteViewProps extends BoxProps {
  className?: string;
  style?: React.CSSProperties;
  sx?: SxProps;
  children?: React.ReactNode;
  hasMore?: boolean;
  loading?: boolean;
  onDataRequest?: () => Promise<void> | void;
  onLoadStart?: () => void;
  onLoadEnd?: (isOk: boolean) => void;
  fallback?: (e: Error) => void;
  throwError?: boolean;
}

const useStyles = makeStyles()({
  root: {
    position: 'relative',
    minHeight: '50px',
    width: '100%',
    overflowY: 'auto',
  },
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
});

export const InfiniteView = ({
  className,
  style,
  sx,
  loading: upperLoading = false,
  throwError = false,
  hasMore = true,
  children,
  onDataRequest,
  onLoadStart,
  onLoadEnd,
  fallback,
  ...otherProps
}: IInfiniteViewProps) => {
  const { classes } = useStyles();

  const [loading, setLoading] = useState(0);
  const observer = useRef<IntersectionObserver>();

  const isMounted = useRef(true);

  useLayoutEffect(
    () => () => {
      isMounted.current = false;
    },
    []
  );

  const currentLoading = !!loading || upperLoading;

  const handleDataRequest = useActualCallback(async () => {
    if (currentLoading) {
      return;
    }
    let isOk = true;
    try {
      onLoadStart && onLoadStart();
      isMounted.current && setLoading((loading) => loading + 1);
      if (onDataRequest) {
        await onDataRequest();
      }
    } catch (e: any) {
      isOk = false;
      if (!throwError) {
        fallback && fallback(e as Error);
      } else {
        throw e;
      }
    } finally {
      onLoadEnd && onLoadEnd(isOk);
      isMounted.current && setLoading((loading) => loading - 1);
    }
  });

  const handleRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (currentLoading) {
        return;
      }
      if (observer.current) {
        observer.current.disconnect();
      }
      observer.current = new IntersectionObserver((entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting && hasMore) {
          handleDataRequest();
        }
      });
      if (node) {
        observer.current.observe(node);
      }
    },
    [hasMore, currentLoading, onDataRequest]
  );

  return (
    <Box
      {...otherProps}
      className={classNames(className, classes.root)}
      style={style}
      sx={sx}
    >
      <Box className={classes.container}>
        {children}
        <div style={{ height: 1 }} ref={handleRef} />
      </Box>
    </Box>
  );
};

export default InfiniteView;
