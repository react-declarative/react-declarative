import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import { SxProps } from "@mui/system";

import { makeStyles } from "../../../styles";

import Paper from "@mui/material/Paper";

import { IGridProps } from "../model/IGridProps";
import { ISize } from "../model/ISize";

import useConstraintManager from "../hooks/useConstraintManager";
import { ContainerSizeProvider } from "../hooks/useContainerSize";

import useSingleton from "../../../hooks/useSingleton";
import classNames from "../../../utils/classNames";

interface Props {
  className?: string;
  style?: React.CSSProperties;
  sx?: SxProps;
  children: React.ReactNode;
  shortHeight: IGridProps["shortHeight"];
}

const useStyles = makeStyles()({
  container: {
    height: "calc(100vh - 200px)",
    overflow: "hidden",
  },
  containerShort: {
    maxHeight: "500px",
  },
});

export const Container = ({
  className,
  style,
  sx,
  children,
  shortHeight,
}: Props) => {
  const { classes } = useStyles();
  const constraintManager = useConstraintManager();
  const [size, setSize] = useState<ISize>({
    height: 0,
    width: 0,
  });
  const resizeObserver = useSingleton(
    () =>
      new ResizeObserver(([entry]) => {
        const target = entry.target as HTMLDivElement;
        if (target) {
          constraintManager.clear();
          setSize({
            height: target.offsetHeight,
            width: target.offsetWidth,
          });
        }
      })
  );
  const handleRef = useCallback(
    (ref: HTMLDivElement | null) => {
      if (!ref) {
        return;
      }
      setSize({
        height: ref.offsetHeight,
        width: ref.offsetWidth,
      });
      resizeObserver.observe(ref);
    },
    [resizeObserver]
  );
  useEffect(
    () => () => {
      resizeObserver.disconnect();
    },
    [resizeObserver]
  );
  return (
    <ContainerSizeProvider size={size}>
      <Paper
        className={classNames(className, classes.container, {
          [classes.containerShort]: shortHeight,
        })}
        style={style}
        sx={sx}
        ref={handleRef}
      >
        {children}
      </Paper>
    </ContainerSizeProvider>
  );
};

export default Container;
