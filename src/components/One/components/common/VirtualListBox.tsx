import * as React from "react";
import { forwardRef } from "react";

import { makeStyles } from "../../../../styles";

import VirtualView from "../../../VirtualView";

import useElementSize from "../../../../hooks/useElementSize";

import classNames from "../../../../utils/classNames";

/**
 * Interface for the props of the VirtualListBox component.
 */
interface IVirtualListBoxProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

const MIN_ROW_HEIGHT = 54;
const MAX_POPUP_HEIGHT = 300;

/**
 * A function that creates a styles object using makeStyles() function from Material-UI.
 *
 * @returns - A styles object with the following properties:
 *  - listBox: Represents the styling for the listBox element, including an "overflow" property set to "hidden !important".
 */
const useStyles = makeStyles()({
  listBox: {
    overflow: "hidden !important",
  },
});

/**
 * A virtual list box component that renders a list of items in a virtualized manner.
 *
 * @component
 *
 * @param props - The props object.
 * @param props.className - The class name to apply to the list box container.
 * @param props.children - The children to render within the list box.
 * @param props.role - The role attribute value for the list box container.
 * @param ref - The ref object for accessing the underlying HTMLDivElement.
 *
 * @returns The rendered list box component.
 */
export const VirtualListBox = forwardRef(
  (
    { className, children, role, ...other }: IVirtualListBoxProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const { classes } = useStyles();

    const { elementRef, size } = useElementSize<HTMLDivElement>();

    const itemCount = Array.isArray(children) ? children.length : 0;

    /**
     * Computes the height for a popup based on the number of items and predefined constants.
     *
     * @return The calculated height for the popup.
     */
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
              scrollbarWidth: 'none',
              "&::-webkit-scrollbar": {
                display: "none",
              },
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
