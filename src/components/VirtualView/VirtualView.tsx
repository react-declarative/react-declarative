import * as React from "react";
import {
  useCallback,
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useMemo,
} from "react";

import { makeStyles } from "../../styles";

import Box, { BoxProps } from "@mui/material/Box";

import useActualCallback from "../../hooks/useActualCallback";
import useActualValue from "../../hooks/useActualValue";
import useSingleton from "../../hooks/useSingleton";
import useSubject from "../../hooks/useSubject";

import throttle from "../../utils/hof/throttle";
import classNames from "../../utils/classNames";
import { TSubject } from "../../utils/rx/Subject";
import sleep from "../../utils/sleep";

const DEFAULT_MIN_HEIGHT = 60;
const DEFAULT_BUFFER_SIZE = 5;

export const ROOT_ELEMENT = "virtual-view-root";
export const CHILD_ELEMENT = "virtual-view-child";

const DATASET_ID = "list_item_idx";

export interface IVirtualViewProps
  extends Omit<
    BoxProps,
    keyof {
      ref: never;
    }
  > {
  withScrollbar?: boolean;
  loading?: boolean;
  hasMore?: boolean;
  minRowHeight?: number;
  bufferSize?: number;
  children: React.ReactNode;
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
    position: "relative",
    overflowY: "auto",
    minHeight: "50px",
  },
  hideScrollbar: {
    "&::-webkit-scrollbar": {
      display: "none",
    },
    scrollbarWidth: "none",
  },
  adjust: {
    position: "absolute",
    visibility: "hidden",
    height: 1,
    width: 1,
    left: 0,
  },
});

export const VirtualView = ({
  className,
  sx,
  withScrollbar = false,
  minRowHeight = DEFAULT_MIN_HEIGHT,
  bufferSize: upperBufferSize = DEFAULT_BUFFER_SIZE,
  children: upperChildren,
  hasMore = true,
  loading: upperLoading = false,
  onDataRequest = () => undefined,
  onLoadStart,
  onLoadEnd,
  fallback,
  scrollXSubject: upperScrollXSubject,
  scrollYSubject: upperScrollYSubject,
  throwError = false,
  ...otherProps
}: IVirtualViewProps) => {
  const { classes } = useStyles();
  const isMounted = useRef(true);
  const isChildrenChanged = useRef(false);

  const scrollXSubject = useSubject(upperScrollXSubject);
  const scrollYSubject = useSubject(upperScrollYSubject);

  const children = useMemo(() => {
    isChildrenChanged.current = true;
    return React.Children.toArray(upperChildren);
  }, [upperChildren]);

  const [loading, setLoading] = useState(0);

  const [rowHeightMap, setRowHeightMap] = useState(
    () => new Map<number, number>()
  );

  const currentLoading = !!loading || upperLoading;

  const hasMore$ = useActualValue(hasMore);
  const minRowHeight$ = useActualValue(minRowHeight);
  const currentLoading$ = useActualValue(currentLoading);

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

  const elementRefMap = useSingleton(() => new Map<number, HTMLDivElement>());

  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  const bufferSize = useMemo(
    () => Math.max(Math.floor(containerHeight / minRowHeight), upperBufferSize),
    [minRowHeight, upperBufferSize, containerHeight]
  );

  const resizeObserver = useSingleton(
    () =>
      new ResizeObserver((entries) =>
        entries.forEach((record) => {
          const element = record.target as HTMLDivElement;
          if (!element) {
            return;
          }
          const { height } = record.contentRect;
          if (element.classList.contains(ROOT_ELEMENT)) {
            setContainerHeight(height);
            elementRefMap.forEach((element) => {
              if (!document.body.contains(element)) {
                return;
              }
              const elementId = Number(element.dataset[DATASET_ID]);
              if (Number.isNaN(elementId)) {
                return;
              }
              const { offsetHeight: height } = element;
              setRowHeightMap((rowHeightMap) => {
                if (rowHeightMap.get(elementId) !== height) {
                  rowHeightMap.set(elementId, Math.max(height, minRowHeight$.current));
                  return new Map(rowHeightMap);
                }
                return rowHeightMap;
              });
            });
          }
          if (element.classList.contains(CHILD_ELEMENT)) {
            const elementId = Number(element.dataset[DATASET_ID]);
            if (!Number.isNaN(elementId)) {
              setRowHeightMap((rowHeightMap) => {
                if (rowHeightMap.get(elementId) !== height) {
                  rowHeightMap.set(elementId, Math.max(height, minRowHeight$.current));
                  return new Map(rowHeightMap);
                }
                return rowHeightMap;
              });
            }
          }
        })
      )
  );

  const getStartIndex = useCallback(
    (scrollPosition: number) => {
      let startScrollPos = scrollPosition;
      let idx = 0;
      children.forEach(() => {
        if (startScrollPos >= 0) {
          startScrollPos -= rowHeightMap.get(idx) || minRowHeight;
          idx += 1;
        }
      });
      return Math.max(idx - bufferSize, 0);
    },
    [rowHeightMap, bufferSize, minRowHeight, children]
  );

  const getEndIndex = useCallback(
    (scrollPosition: number, totalLength: number) => {
      let endScrollPos = scrollPosition + containerHeight;
      let idx = 0;
      children.forEach(() => {
        if (endScrollPos >= 0) {
          endScrollPos -= rowHeightMap.get(idx) || minRowHeight;
          idx += 1;
        }
      });
      return Math.min(idx - 1 + bufferSize, totalLength - 1);
    },
    [rowHeightMap, bufferSize, containerHeight, minRowHeight, children]
  );

  const getTopPos = useCallback(
    (elementIndex: number) => {
      let totalTop = 0;
      children.slice(0, elementIndex).forEach((_, idx) => {
        totalTop += rowHeightMap.get(idx) || minRowHeight;
      });
      return totalTop;
    },
    [rowHeightMap, minRowHeight, children]
  );

  const scrollAdjust = useMemo(() => {
    let totalHeight = 0;
    children.forEach((_, idx) => {
      totalHeight += rowHeightMap.get(idx) || minRowHeight;
    });
    return totalHeight;
  }, [rowHeightMap, children, minRowHeight]);

  const getBottomReached = useCallback(() => {
    if (container) {
      if (container.clientHeight >= container.scrollHeight) {
        return false;
      }
      const scrollPos =
        container.scrollHeight - container.scrollTop - container.clientHeight;
      return Math.abs(scrollPos) < 10;
    }
    return false;
  }, [container]);

  const visibleChildren = React.useMemo(() => {
    const startIndex = getStartIndex(scrollPosition);
    const endIndex = getEndIndex(scrollPosition, children.length);

    const elementEntries = Array.from(elementRefMap.entries());

    elementEntries.forEach(([index, element]) => {
      if (index < startIndex || index > endIndex) {
        resizeObserver.unobserve(element);
        elementRefMap.delete(index);
      }
    });

    let isBottomReached = true;
    isBottomReached = isBottomReached && hasMore$.current;
    isBottomReached = isBottomReached && !currentLoading$.current;
    isBottomReached = isBottomReached && getBottomReached();
    isBottomReached = isBottomReached && children.length === endIndex + 1;

    if (isBottomReached && !isChildrenChanged.current) {
      queueMicrotask(() => handleDataRequest(false));
    }

    isChildrenChanged.current = false;

    return children.slice(startIndex, endIndex + 1).map((child, index) =>
      React.cloneElement(child as React.ReactElement, {
        ref: (element: HTMLDivElement | null) => {
          if (!element) {
            return;
          }
          const elementIdx = startIndex + index;
          const prevElement = elementRefMap.get(elementIdx);
          if (prevElement === element) {
            return;
          }
          prevElement && resizeObserver.unobserve(prevElement);
          element.classList.add(CHILD_ELEMENT);
          element.dataset[DATASET_ID] = String(elementIdx);
          resizeObserver.observe(element);
          elementRefMap.set(elementIdx, element);
          setRowHeightMap((rowHeightMap) => {
            let isChanged = rowHeightMap.get(elementIdx) !== element.offsetHeight;
            if (isChanged) {
              rowHeightMap.set(elementIdx, Math.max(element.offsetHeight, minRowHeight));
              return new Map(rowHeightMap);
            } else {
              return rowHeightMap;
            }
          });
        },
        style: {
          position: "absolute",
          top: getTopPos(startIndex + index),
          minHeight: minRowHeight,
          minWidth: "100%",
          left: 0,
        },
      })
    );
  }, [
    hasMore$,
    currentLoading$,
    children,
    minRowHeight,
    scrollPosition,
    rowHeightMap,
    getStartIndex,
    getEndIndex,
    getTopPos,
    getBottomReached,
    handleDataRequest,
  ]);

  const handleRef = useCallback((element: HTMLDivElement | null) => {
    if (element) {
      element.addEventListener(
        "scroll",
        throttle((e: any) => {
          setScrollPosition(e.target.scrollTop);
        }, 50)
      );
      setContainerHeight(element.offsetHeight);
      scrollXSubject.unsubscribeAll();
      scrollXSubject.subscribe((scrollX) => {
        if (element.scrollLeft !== scrollX) {
          element.scrollTo(
            Math.min(scrollX, element.scrollWidth),
            element.scrollTop
          );
        }
      });
      scrollYSubject.unsubscribeAll();
      scrollYSubject.subscribe((scrollX) => {
        if (element.scrollLeft !== scrollX) {
          element.scrollTo(
            Math.min(scrollX, element.scrollWidth),
            element.scrollTop
          );
        }
      });
      setContainer(element);
      resizeObserver.observe(element);
    }
  }, []);

  useEffect(
    () => () => {
      resizeObserver.disconnect();
      scrollXSubject.unsubscribeAll();
      scrollYSubject.unsubscribeAll();
    },
    []
  );

  useEffect(() => {
    handleDataRequest(true);
  }, []);

  useLayoutEffect(
    () => () => {
      isMounted.current = false;
    },
    []
  );

  return (
    <Box
      className={classNames(className, classes.root, ROOT_ELEMENT, {
        [classes.hideScrollbar]: !withScrollbar,
      })}
      sx={{
        width: "100%",
        ...sx,
      }}
      {...otherProps}
      ref={handleRef}
    >
      {visibleChildren}
      <div
        className={classes.adjust}
        style={{
          top: scrollAdjust,
        }}
      />
    </Box>
  );
};

export default VirtualView;
