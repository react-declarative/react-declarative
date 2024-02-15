import * as React from "react";
import { forwardRef } from "react";

import { makeStyles } from "../../../../styles";

import VirtualView from "../../../VirtualView";

import useElementSize from "../../../../hooks/useElementSize";

import classNames from "../../../../utils/classNames";

interface IVirtualListBoxProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

const MIN_ROW_HEIGHT = 54;
const MAX_POPUP_HEIGHT = 300;

const useStyles = makeStyles()({
  listBox: {
    overflow: "hidden !important",
  },
});

export const VirtualListBox = forwardRef(
  (
    { className, children, role, ...other }: IVirtualListBoxProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const { classes } = useStyles();

    const { elementRef, size } = useElementSize<HTMLDivElement>();

    const itemCount = Array.isArray(children) ? children.length : 0;

    const computeHeight = () =>
      itemCount
        ? Math.min(itemCount * MIN_ROW_HEIGHT, MAX_POPUP_HEIGHT)
        : MIN_ROW_HEIGHT;

    return (
      <div ref={ref}>
        <div
          {...other}
          ref={elementRef}
          className={classNames(classes.listBox, className)}
        >
          <VirtualView
            role={role}
            sx={{
              width: size.width,
              height: `min(${computeHeight()}px, 45vh)`,
              maxHeight: '45vh',
            }}
            minRowHeight={MIN_ROW_HEIGHT}
          >
            {children}
          </VirtualView>
        </div>
      </div>
    );
  }
);

export default VirtualListBox;
