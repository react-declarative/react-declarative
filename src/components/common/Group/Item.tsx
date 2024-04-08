import * as React from 'react';
import { forwardRef, useMemo } from 'react';

import { makeStyles } from '../../../styles';

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import classNames from '../../../utils/classNames';

import { IManagedLayout, PickProp } from '../../../model/IManaged';

import IField from '../../../model/IField';

const FULL_ROW = '12';

const n = (v: string) => Number(v) as any;

/**
 * Interface representing the props for an item component.
 *
 * @interface IItemProps
 * @extends Omit<IManagedLayout, 'hidden'>
 */
interface IItemProps extends Omit<IManagedLayout, 'hidden'> {
  className: PickProp<IField, 'className'>;
  style: PickProp<IField, 'style'>;
  children: React.ReactNode;
  onFocus?: () => void;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onContextMenu?: React.MouseEventHandler<HTMLDivElement>;
}

/**
 * The useStyles variable is a function that returns an object containing CSS styles.
 * It uses the makeStyles hook provided by the Material-UI library.
 *
 * The returned styles object has two properties: root and container.
 * - The root property contains the CSS styles for the root element.
 * - The container property contains the CSS styles for the container element.
 *
 * The root property contains the following styles:
 * - position: "relative" - Specifies that the element is positioned relative to its normal position.
 * - display: "flex" - Specifies that the element is displayed as a flex container.
 * - alignItems: "stretch" - Specifies the alignment of flex items along the cross axis to stretch.
 * - justifyContent: "stretch" - Specifies the alignment of flex items along the main axis to stretch.
 *
 * The container property contains the following styles:
 * - flex: 1 - Specifies that the element should take up the remaining space in its parent container.
 * - display: "flex" - Specifies that the element is displayed as a flex container.
 * - alignItems: "stretch" - Specifies the alignment of flex items along the cross axis to stretch.
 * - justifyContent: "stretch" - Specifies the alignment of flex items along the main axis to stretch.
 * - width: "100%" - Specifies the width of the element to be 100% of its parent container.
 * - '& > *': { flex: 1 } - Specifies that all direct children of the element should take up equal space.
 *
 * @returns An object containing CSS styles for the root and container elements.
 */
const useStyles = makeStyles()({
  root: {
    position: "relative",
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
  },
  container: {
    flex: 1,
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
    width: "100%",
    '& > *': {
      flex: 1,
    },
  },
});

/**
 * Represents an item in a grid layout.
 * @typedef Item
 * @param className - The CSS class to apply to the item.
 * @param style - The inline style object to apply to the item.
 * @param sx - The sx prop for the item.
 * @param columns - The number of columns the item should occupy in all screen sizes.
 * @param phoneColumns - The number of columns the item should occupy on phones.
 * @param tabletColumns - The number of columns the item should occupy on tablets.
 * @param desktopColumns - The number of columns the item should occupy on desktops.
 * @param fieldRightMargin - The right margin for the item.
 * @param fieldBottomMargin - The bottom margin for the item.
 * @param children - The child elements of the item.
 * @param onClick - The click event handler for the item.
 * @param onFocus - The focus event handler for the item.
 * @param onContextMenu - The context menu event handler for the item.
 * @param otherProps - Additional props to apply to the item.
 * @param ref - The ref object for the item.
 * @returns - The rendered item element.
 */
export const Item = ({
  className,
  style,
  sx,
  columns = "",
  phoneColumns = "",
  tabletColumns = "",
  desktopColumns = "",
  fieldRightMargin = '1',
  fieldBottomMargin = '2',
  children,
  onClick,
  onFocus,
  onContextMenu,
  ...otherProps
}: IItemProps, ref: React.Ref<HTMLDivElement>) => {
  const { classes } = useStyles();

  const {
    xs,
    sm,
    md,
    lg,
    xl,
    mr,
    mb,
  } = useMemo(() => {
    const xs = n(phoneColumns || columns || FULL_ROW);
    const sm = n(tabletColumns || columns || FULL_ROW);
    const md = n(tabletColumns || columns || FULL_ROW);
    const lg = n(desktopColumns || columns || FULL_ROW);
    const xl = n(desktopColumns || columns || FULL_ROW);
    const mr = n(fieldRightMargin);
    const mb = n(fieldBottomMargin);
    /**
     * Configuration object for defining responsive breakpoints and margin values.
     * @property xs - The extra small breakpoint value in pixels.
     * @property sm - The small breakpoint value in pixels.
     * @property md - The medium breakpoint value in pixels.
     * @property lg - The large breakpoint value in pixels.
     * @property xl - The extra large breakpoint value in pixels.
     * @property mr - The margin right value in pixels.
     * @property mb - The margin bottom value in pixels.
     */
    return {
      xs,
      sm,
      md,
      lg,
      xl,
      mr,
      mb,
    };
  }, []);

  return (
    <Grid
      {...otherProps}
      ref={ref}
      item={true}
      className={classNames(className, classes.root)}
      style={style}
      onFocus={onFocus}
      onClick={onClick}
      xs={xs}
      sm={sm}
      md={md}
      lg={lg}
      xl={xl}
      sx={sx}
      onContextMenu={onContextMenu}
    >
      <Box
        className={classes.container}
        mr={mr}
        mb={mb}
      >
        {children}
      </Box>
    </Grid>
  );
};

Item.displayName = 'Item';

export default forwardRef(Item);
