import * as React from "react";

import { makeStyles } from "../../styles";

import classNames from "../../utils/classNames";

import AutoSizer, { IAutoSizerProps } from "../AutoSizer";

import IAnything from "../../model/IAnything";

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
    overflowX: "auto !important" as "auto",
  },
  overflowY: {
    overflowY: "auto !important" as "auto",
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

interface IScrollViewProps<T extends IAnything = IAnything> {
  withScrollbar?: boolean;
  hideOverflowX?: boolean;
  hideOverflowY?: boolean;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  center?: boolean;
  payload?: IAutoSizerProps<T>["payload"];
}

export const ScrollView = <T extends IAnything = IAnything>({
  children,
  className,
  style,
  payload,
  center = false,
  withScrollbar = false,
  hideOverflowX = false,
  hideOverflowY = false,
}: IScrollViewProps<T>) => {
  const { classes } = useStyles();
  return (
    <div className={classNames(className, classes.root)} style={style}>
      <AutoSizer
        className={classNames(classes.container, SCROLL_VIEW_TARGER, {
            [classes.hideScrollbar]: !withScrollbar,
            [classes.overflowX]: !hideOverflowX,
            [classes.overflowY]: !hideOverflowY,
        })}
        payload={payload}
      >
        {({ height, width }) => (
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
        )}
      </AutoSizer>
    </div>
  );
};

export default ScrollView;
