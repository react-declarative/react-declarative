import * as React from "react";
import { useCallback, useState, useEffect } from "react";

import { makeStyles } from "../../styles";

import Box, { BoxProps } from "@mui/material/Box";

import useSingleton from "../../hooks/useSingleton";
import throttle from "../../utils/hof/throttle";
import classNames from "../../utils/classNames";
import useActualCallback from "../../hooks/useActualCallback";

const DEFAULT_MIN_HEIGHT = 60;
const DEFAULT_BUFFER_SIZE = 5;

const ROOT_ELEMENT = "virtual-view-root";
const CHILD_ELEMENT = "virtual-view-child";
const DATASET_ID = "list_item_id";

interface IVirtualViewProps
  extends Omit<
    BoxProps,
    keyof {
      ref: never;
    }
  > {
  hasMore?: boolean;
  minHeight?: number;
  bufferSize?: number;
  children: React.ReactElement[];
  onDataRequest?: () => void;
}

const useStyles = makeStyles()({
  root: {
    position: "relative",
    overflowY: 'auto',
    height: "100%",
    width: "100%",
  },
});

export const VirtualView = ({
  className,
  minHeight = DEFAULT_MIN_HEIGHT,
  bufferSize = DEFAULT_BUFFER_SIZE,
  children: upperChildren,
  hasMore = true,
  onDataRequest = () => undefined,
  ...otherProps
}: IVirtualViewProps) => {
  const { classes } = useStyles();

  const [rowHeightMap, setRowHeightMap] = useState(
    () => new Map<number, number>()
  );

  const onDataRequest$ = useActualCallback(onDataRequest);

  const elementRefMap = useSingleton(() => new Map<number, HTMLDivElement>());

  const [scrollPosition, setScrollPosition] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  const resizeObserver = useSingleton(
    () =>
      new ResizeObserver(([record]) => {
        const element = record.target as HTMLDivElement;
        if (!element) {
          return;
        }
        if (element.classList.contains(ROOT_ELEMENT)) {
          setContainerHeight(element.offsetHeight);
        }
        if (element.classList.contains(CHILD_ELEMENT)) {
          const elementId = Number(element.dataset[DATASET_ID]);
          const { offsetHeight } = element;
          if (!Number.isNaN(elementId) && offsetHeight > minHeight) {
            setRowHeightMap((rowHeightMap) => {
              rowHeightMap.set(elementId, element.offsetHeight);
              return new Map(rowHeightMap);
            });
          }
        }
      })
  );

  const getStartIndex = useCallback(
    (scrollPosition: number) => {
      let startScrollPos = scrollPosition;
      let idx = 0;
      while (startScrollPos >= 0) {
        startScrollPos -= rowHeightMap.get(idx) || minHeight;
        idx++;
      }
      return Math.max(idx - bufferSize, 0);
    },
    [rowHeightMap, bufferSize]
  );

  const getEndIndex = useCallback(
    (scrollPosition: number, totalLength: number) => {
      let endScrollPos = scrollPosition + containerHeight;
      let idx = 0;
      while (endScrollPos >= 0) {
        endScrollPos -= rowHeightMap.get(idx) || minHeight;
        idx++;
      }
      return Math.min(idx - 1 + bufferSize, totalLength - 1);
    },
    [rowHeightMap, bufferSize, containerHeight]
  );

  const getTopPos = useCallback(
    (elementIndex: number) => {
      let totalTop = 0;
      for (let idx = 0; idx !== elementIndex; idx++) {
        totalTop += rowHeightMap.get(idx) || minHeight;
      }
      return totalTop;
    },
    [rowHeightMap, minHeight]
  );

  const visibleChildren = React.useMemo(() => {
    const children = React.Children.toArray(upperChildren);

    const startIndex = getStartIndex(scrollPosition);
    const endIndex = getEndIndex(scrollPosition, children.length);

    for (const [index, element] of elementRefMap.entries()) {
      if (index < startIndex || index > endIndex) {
        resizeObserver.unobserve(element);
        elementRefMap.delete(index);
      }
    }

    let isBottomReached = true;
    isBottomReached = isBottomReached && hasMore;
    isBottomReached = isBottomReached && scrollPosition > containerHeight;
    isBottomReached = isBottomReached && children.length === endIndex + 1;

    if (isBottomReached) {
      onDataRequest$();
    }

    return children.slice(startIndex, endIndex + 1).map((child, index) =>
      React.cloneElement(child as React.ReactElement, {
        ref: (element: HTMLDivElement | null) => {
          if (!element) {
            return;
          }
          const elementIdx = startIndex + index;
          const prevElement = elementRefMap.get(elementIdx);
          prevElement && resizeObserver.unobserve(prevElement);
          element.classList.add(CHILD_ELEMENT);
          element.dataset[DATASET_ID] = String(elementIdx);
          resizeObserver.observe(element);
          elementRefMap.set(elementIdx, element);
        },
        style: {
          position: "absolute",
          top: getTopPos(startIndex + index),
          minHeight: minHeight,
          left: 0,
          right: 0,
        },
      })
    );
  }, [
    hasMore,
    upperChildren,
    containerHeight,
    minHeight,
    scrollPosition,
    rowHeightMap,
    getStartIndex,
    getEndIndex,
    getTopPos,
    onDataRequest$,
  ]);

  const handleRef = useCallback((element: HTMLDivElement | null) => {
    if (element) {
      element.addEventListener("scroll", throttle((e: any) => {
        setScrollPosition(e.target.scrollTop)
      }, 50));
      setContainerHeight(element.offsetHeight);
    }
  }, []);

  useEffect(
    () => () => {
      resizeObserver.disconnect();
    },
    []
  );

  return (
    <Box
      className={classNames(className, classes.root, ROOT_ELEMENT)}
      {...otherProps}
      ref={handleRef}
    >
      {visibleChildren}
    </Box>
  );
};

export default VirtualView;
