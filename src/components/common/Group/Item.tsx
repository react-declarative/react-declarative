import * as React from 'react';
import { forwardRef } from 'react';

import { makeStyles } from '../../../styles';

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import classNames from '../../../utils/classNames';

import { IManagedLayout, PickProp } from '../../../model/IManaged';

import IField from '../../../model/IField';

const FULL_ROW = '12';

const n = (v: string) => Number(v) as any;

interface IItemProps extends IManagedLayout {
  className: PickProp<IField, 'className'>;
  style: PickProp<IField, 'style'>;
  children: React.ReactChild;
  onFocus?: () => void;
}

const useStyles = makeStyles({
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
  columns = "",
  phoneColumns = "",
  tabletColumns = "",
  desktopColumns = "",
  fieldRightMargin = '1',
  fieldBottomMargin = '2',
  children,
  onFocus,
}: IItemProps, ref: React.Ref<HTMLDivElement>) => {
  const classes = useStyles();
  return (
    <Grid
      ref={ref}
      item={true}
      className={classNames(className, classes.root)}
      style={style}
      onFocus={onFocus}
      xs={n(phoneColumns || columns || FULL_ROW)}
      sm={n(tabletColumns || columns || FULL_ROW)}
      md={n(tabletColumns || columns || FULL_ROW)}
      lg={n(desktopColumns || columns || FULL_ROW)}
      xl={n(desktopColumns || columns || FULL_ROW)}
    >
      <Box
        className={classes.container}
        mr={n(fieldRightMargin)}
        mb={n(fieldBottomMargin)}
      >
        {children}
      </Box>
    </Grid>
  );
};

Item.displayName = 'Item';

export default forwardRef(Item);
