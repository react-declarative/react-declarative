import * as React from "react";
import { useState, useLayoutEffect } from "react";
import { makeStyles } from "../../styles";

import Fab, { FabProps } from "@mui/material/Fab";

import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import classNames from "../../utils/classNames";

const SCROLL_DELTA = 40;

const useStyles = makeStyles()({
  root: {
    position: "fixed",
    bottom: 10,
    right: 10,
    transition: "opacity 500ms",
  },
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
});

type IScrollTopViewProps = Omit<
  FabProps,
  keyof {
    onClick: never;
  }
> & {
    scrollTarget?: HTMLElement;
};

export const ScrollTopView = ({
  className,
  style,
  sx,
  scrollTarget = document.documentElement,
}: IScrollTopViewProps) => {
  const { classes } = useStyles();

  const [visible, setVisible] = useState(false);

  useLayoutEffect(() => {
    const handler = () => {
        const { scrollTop: scroll } = scrollTarget;
        setVisible(scroll > SCROLL_DELTA);
    };
    scrollTarget.addEventListener('scroll', handler, {
        passive: true,
    });
    return () => scrollTarget.removeEventListener('scroll', handler);
  }, [scrollTarget]);

  return (
    <Fab
      className={classNames(className, classes.root, {
        [classes.visible]: visible,
        [classes.hidden]: !visible,
      })}
      style={style}
      sx={sx}
    >
        <KeyboardArrowUpIcon />
    </Fab>
  );
};

export default ScrollTopView;
