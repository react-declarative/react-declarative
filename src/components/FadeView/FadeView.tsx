import * as React from "react";

import { makeStyles } from "../../styles";

import Box from "@mui/material/Box";

import AutoSizer, { IAutoSizerProps } from "../AutoSizer";

import FadeContainer, {
  IFadeContainerProps,
  SCROLL_VIEW_TARGER,
} from "./components/FadeContainer";

import classNames from "../../utils/classNames";

type FadeContainerT = Pick<
  IFadeContainerProps,
  keyof {
    Fade: never;
    color: never;
    zIndex: never;
    disableBottom: never;
    disableRight: never;
  }
>;

interface IFadeViewProps<T extends any = unknown> extends FadeContainerT {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  payload?: IAutoSizerProps<T>["payload"];
}

const useStyles = makeStyles()({
  root: {
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
    height: '100%',
    width: '100%',
  },
  container: {
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
    flex: 1,
  },
  content: {
    position: 'relative',
    overflow: "auto !important",
    scrollbarWidth: "none",
    "&::-webkit-scrollbar": {
      display: "none",
    },
    flex: 1,
  },
});

export const FadeView = <T extends any = any>({
  className,
  style,
  children,
  Fade,
  color,
  zIndex,
  disableBottom,
  disableRight,
  payload,
}: IFadeViewProps<T>) => {
  const { classes } = useStyles();
  return (
    <Box className={className} style={style}>
      <AutoSizer className={classes.root} payload={payload}>
        {({ height, width }) => (
          <FadeContainer
            className={classes.container}
            Fade={Fade}
            color={color}
            zIndex={zIndex}
            disableBottom={disableBottom}
            disableRight={disableRight}
          >
            <Box
              className={classNames(SCROLL_VIEW_TARGER, classes.content)}
              sx={{
                '& > *': {
                  minHeight: height,
                  minWidth: width,
                },
                maxHeight: height,
                maxWidth: width,
                height: '100%',
                width: '100%',
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  display: 'flex',
                  alignItems: 'stretch',
                  justifyContent: 'stretch',
                  '& > *': {
                    flex: 1,
                  },
                }}
              >
                {children}
              </Box>
            </Box>
          </FadeContainer>
        )}
      </AutoSizer>
    </Box>
  );
};

export default FadeView;
