import * as React from "react";
import { useRef, useCallback, useState, useMemo, useLayoutEffect, useEffect } from "react";

import { makeStyles } from "../../styles";

import Box, { BoxProps } from "@mui/material/Box";
import { SxProps } from "@mui/material";

import useActualCallback from "../../hooks/useActualCallback";
import useActualValue from "../../hooks/useActualValue";
import useSubject from "../../hooks/useSubject";

import TSubject from "../../model/TSubject";

import classNames from "../../utils/classNames";
import sleep from "../../utils/sleep";

/**
 * Represents the props for the InfiniteView component.
 */
interface IInfiniteViewProps extends BoxProps {
  className?: string;
  style?: React.CSSProperties;
  sx?: SxProps<any>;
  children?: React.ReactNode;
  hasMore?: boolean;
  loading?: boolean;
  scrollXSubject?: TSubject<number>;
  scrollYSubject?: TSubject<number>;
  onDataRequest?: (initial: boolean) => Promise<void> | void;
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

/**
 * InfiniteView component
 * @param props - Component props
 * @param props.className - Custom CSS class name
 * @param props.style - Custom inline styles
 * @param props.sx - SX prop from theme-ui
 * @param [props.loading=false] - Loading state of the component
 * @param [props.throwError=false] - Whether or not to throw errors
 * @param [props.hasMore=true] - Whether there is more data to load
 * @param props.children - Child components to render
 * @param props.scrollXSubject - Subject for horizontal scroll position
 * @param props.scrollYSubject - Subject for vertical scroll position
 * @param props.onDataRequest - Callback function to request data
 * @param props.onLoadStart - Callback function called when data loading starts
 * @param props.onLoadEnd - Callback function called when data loading ends
 * @param props.fallback - Fallback component to render in case of error
 * @returns Rendered component
 */
export const InfiniteView = ({
  className,
  style,
  sx,
  loading: upperLoading = false,
  throwError = false,
  hasMore = true,
  children: upperChildren,
  scrollXSubject: upperScrollXSubject,
  scrollYSubject: upperScrollYSubject,
  onDataRequest,
  onLoadStart,
  onLoadEnd,
  fallback,
  ...otherProps
}: IInfiniteViewProps) => {
  const { classes } = useStyles();

  const scrollXSubject = useSubject(upperScrollXSubject);
  const scrollYSubject = useSubject(upperScrollYSubject);

  const [loading, setLoading] = useState(0);
  const observer = useRef<IntersectionObserver>();

  const isMounted = useRef(true);
  const isChildrenChanged = useRef(false);

  const children = useMemo(() => {
    isChildrenChanged.current = true;
    return upperChildren;
  }, [upperChildren]);

  useLayoutEffect(
    () => () => {
      isMounted.current = false;
    },
    []
  );

  const currentLoading = !!loading || upperLoading;

  const currentLoading$ = useActualValue(currentLoading);
  const hasMore$ = useActualValue(hasMore);

  const handleDataRequest = useActualCallback(async (initial: boolean) => {
    if (currentLoading) {
      return;
    }
    let isOk = true;
    try {
      onLoadStart && onLoadStart();
      isMounted.current && setLoading((loading) => loading + 1);
      if (onDataRequest) {
        /** react-18 prevent batching */
        await sleep(0);
        await onDataRequest(initial);
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
        let isBottomReached = true;
        isBottomReached = isBottomReached && hasMore$.current;
        isBottomReached = isBottomReached && !currentLoading$.current;
        if (entry?.isIntersecting && isBottomReached && !isChildrenChanged.current) {
          handleDataRequest(false);
        }
        isChildrenChanged.current = false;
      });
      if (node) {
        observer.current.observe(node);
      }
    },
    [hasMore, currentLoading, onDataRequest]
  );

  useEffect(() => {
    handleDataRequest(true);
  }, []);

  useEffect(
    () => () => {
      if (observer.current) {
        observer.current.disconnect();
      }
      scrollXSubject.unsubscribeAll();
      scrollYSubject.unsubscribeAll();
    },
    []
  );

  const handleScroll = useCallback((node: HTMLDivElement | null) => {
    if (!node) {
      return;
    }
    scrollXSubject.unsubscribeAll();
    scrollXSubject.subscribe((scrollX) => {
      if (node.scrollLeft !== scrollX) {
        node.scrollTo(
          Math.min(scrollX, node.scrollWidth),
          node.scrollTop,
        );
      }
    });
    scrollYSubject.unsubscribeAll();
    scrollYSubject.subscribe((scrollX) => {
      if (node.scrollLeft !== scrollX) {
        node.scrollTo(
          Math.min(scrollX, node.scrollWidth),
          node.scrollTop,
        );
      }
    });
  }, []);

  return (
    <Box
      {...otherProps}
      className={classNames(className, classes.root)}
      style={style}
      sx={sx}
      ref={handleScroll}
    >
      <Box className={classes.container}>
        {children}
        <div style={{ height: 1 }} ref={handleRef} />
      </Box>
    </Box>
  );
};

export default InfiniteView;
