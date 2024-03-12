import * as React from "react";

import { makeStyles } from "../../styles";

import Box from "@mui/material/Box";

import useElementSize from "../../hooks/useElementSize";

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

interface IFadeViewProps extends FadeContainerT {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
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

/**
 * Represents a fade view component with various customizable options.
 * @param {Object} props - The properties for the FadeView component.
 * @param {string} props.className - The CSS class name for the FadeView component.
 * @param {Object} props.style - The inline style object for the FadeView component.
 * @param {React.ReactNode} props.children - The child elements of the FadeView component.
 * @param {React.ComponentType} props.Fade - The fade effect component to be used.
 * @param {string} props.color - The color of the fade effect.
 * @param {number} props.zIndex - The z-index of the fade effect.
 * @param {boolean} props.disableBottom - Determines if the fade effect should be disabled at the bottom.
 * @param {boolean} props.disableRight - Determines if the fade effect should be disabled at the right side.
 * @returns {JSX.Element} - The rendered FadeView component.
 */
export const FadeView = ({
  className,
  style,
  children,
  Fade,
  color,
  zIndex,
  disableBottom,
  disableRight,
}: IFadeViewProps) => {
  const { classes } = useStyles();
  const { elementRef, size: { height, width } } = useElementSize<HTMLDivElement>();
  return (
    <Box className={className} style={style}>
      <div ref={elementRef} className={classes.root}>
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
      </div>
    </Box>
  );
};

export default FadeView;
