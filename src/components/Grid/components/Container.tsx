import * as React from "react";
import { useCallback, useEffect, useState, useMemo } from "react";
import { SxProps } from "@mui/material";

import { makeStyles } from "../../../styles";
import { alpha } from "@mui/material";

import { ISize } from "../model/ISize";

import { useConstraintManager } from "../hooks/useConstraintManager";
import { ContainerSizeProvider } from "../hooks/useContainerSize";
import { getScrollbarWidth } from "../helpers/getScrollbarWidth";
import { getScrollbarHeight } from "../helpers/getScrollbarHeight";

import useSingleton from "../../../hooks/useSingleton";

import classNames from "../../../utils/classNames";
import PaperView from "../../PaperView";

/**
 * Props interface for Props class.
 */
interface Props {
  className?: string;
  outlinePaper?: boolean;
  transparentPaper?: boolean;
  style?: React.CSSProperties;
  sx?: SxProps<any>;
  header?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Custom hook to generate styles using the makeStyles() function from Material-UI.
 * @param {Object} theme - The theme object provided by the Material-UI theme provider.
 * @returns {Object} - The generated styles object.
 */
const useStyles = makeStyles()((theme) => ({
  root: {
    width: "100%",
    overflow: "hidden",
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'stretch',
    background: theme.palette.mode === 'light'
      ? theme.palette.background.paper
      : alpha('#000', 0.05),
  },
  container: {
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'stretch',
    flexDirection: 'column',
    flex: 1,
  },
  content: {
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'stretch',
    flexDirection: 'column',
    flex: 1,
  },
  header: {
    minHeight: '35px',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    background: theme.palette.mode === 'light'
      ? alpha('#000', 0.05)
      : theme.palette.background.paper,
  },
}));

/**
 * Represents a container component that wraps and displays its children.
 *
 * @typedef {Object} Props - The props for the Container component.
 * @property {boolean} outlinePaper - Determines whether to display outline paper for the Container.
 * @property {boolean} transparentPaper - Determines whether the Container paper is transparent.
 * @property {string} className - The CSS class name for the Container.
 * @property {Object} style - The CSS styles for the Container.
 * @property {Object} sx - The theme styles for the Container.
 * @property {ReactNode} header - The header content for the Container.
 * @property {ReactNode} children - The children elements of the Container.
 */
export const Container = ({
  outlinePaper,
  transparentPaper,
  className,
  style,
  sx,
  header,
  children,
}: Props) => {
  const { classes } = useStyles();
  const constraintManager = useConstraintManager();
  const scrollBarWidth = useMemo(() => getScrollbarWidth(), []);
  const scrollBarHeight = useMemo(() => getScrollbarHeight(), []);
  const [size, setSize] = useState<ISize>({
    height: 0,
    width: 0,
  });
  /**
   * Singleton instance of `ResizeObserver` used to track and handle element resizing.
   *
   * @typedef {Object} ResizeObserver
   * @property {Function} useSingleton - Singleton pattern wrapper function.
   * @property {Function} clear - Clear the constraint manager.
   * @property {Function} setSize - Set the size of the target element.
   */
  const resizeObserver = useSingleton(
    () =>
      new ResizeObserver(([entry]) => {
        const target = entry.target as HTMLDivElement;
        if (target) {
          constraintManager.clear();
          setSize({
            height: Math.max(target.offsetHeight - scrollBarHeight, 0),
            width: Math.max(target.offsetWidth - scrollBarWidth, 0),
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
        height: Math.max(ref.offsetHeight - scrollBarHeight, 0),
        width: Math.max(ref.offsetWidth - scrollBarWidth, 0),
      });
      resizeObserver.observe(ref);
    },
    [resizeObserver, scrollBarWidth, scrollBarHeight]
  );
  useEffect(
    () => () => {
      resizeObserver.disconnect();
    },
    [resizeObserver]
  );
  return (
    <ContainerSizeProvider size={size}>
      <PaperView
        outlinePaper={outlinePaper}
        transparentPaper={transparentPaper}
        className={classNames(className, classes.root)}
        style={style}
        sx={sx}
      >
        <div className={classes.container}>
          {!!header && (
            <div className={classes.header}>
              {header}
            </div>
          )}
          <div className={classes.content} ref={handleRef}>
            {children}
          </div>
        </div>
      </PaperView>
    </ContainerSizeProvider>
  );
};

export default Container;
