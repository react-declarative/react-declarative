import * as React from "react";

import { makeStyles } from "../../styles";

import Box from "@mui/material/Box";

import classNames from "../../utils/classNames";

import useElementSize from "../../hooks/useElementSize";
import { BoxProps } from "@mui/material";

export const SCROLL_VIEW_TARGER = "react-declarative__scrollViewTarget";

const useStyles = makeStyles()({
  root: {
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
  },
  container: {
    flex: 1,
    position: "relative",
    scrollbarWidth: "none",
  },
  overflowX: {
    overflowX: "auto",
  },
  noOverflowX: {
    overflowX: "hidden",
  },
  overflowY: {
    overflowY: "auto",
  },
  noOverflowY: {
    overflowY: "hidden",
  },
  hideScrollbar: {
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
  content: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  stretch: {
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
    "& > *": {
      flex: 1,
    },
  },
  center: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

interface IScrollViewProps extends BoxProps {
  withScrollbar?: boolean;
  hideOverflowX?: boolean;
  hideOverflowY?: boolean;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  center?: boolean;
}

export const ScrollView = ({
  children,
  className,
  style,
  center = false,
  withScrollbar = false,
  hideOverflowX = false,
  hideOverflowY = false,
  ...otherProps
}: IScrollViewProps) => {
  const { classes } = useStyles();
  const {
    elementRef,
    size: { height, width },
  } = useElementSize<HTMLDivElement>();
  return (
    <Box
      className={classNames(className, classes.root)}
      style={style}
      {...otherProps}
    >
      <div
        ref={elementRef}
        className={classNames(classes.container, SCROLL_VIEW_TARGER, {
          [classes.hideScrollbar]: !withScrollbar,
          [classes.overflowX]: !hideOverflowX,
          [classes.overflowY]: !hideOverflowY,
          [classes.noOverflowX]: hideOverflowX,
          [classes.noOverflowY]: hideOverflowY,
        })}
      >
        <div
          className={classNames(classes.content, {
            [classes.stretch]: !center,
            [classes.center]: center,
          })}
          style={{
            minHeight: height,
            minWidth: width,
          }}
        >
          {children}
        </div>
      </div>
    </Box>
  );
};

export default ScrollView;
