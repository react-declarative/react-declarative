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

interface IItemProps extends Omit<IManagedLayout, 'hidden'> {
  className: PickProp<IField, 'className'>;
  style: PickProp<IField, 'style'>;
  children: React.ReactNode;
  onFocus?: () => void;
  onContextMenu?: React.MouseEventHandler<HTMLDivElement>;
}

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
