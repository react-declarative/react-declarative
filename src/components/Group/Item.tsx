import * as React from 'react';
import { forwardRef } from 'react';

import { Grid, Box } from "@material-ui/core";

import { IManagedLayout, PickProp } from '../../model/IManaged';
import IField from '../../model/IField';

const FULL_ROW = '12';

const n = (v: string)=> Number(v) as any;

interface IItemProps extends IManagedLayout {
  className: PickProp<IField, 'className'>;
  style: PickProp<IField, 'style'>;
  children: React.ReactChild;
  onFocus?: () => void;
}

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
}: IItemProps, ref: React.Ref<HTMLDivElement>) => (
  <Grid
    ref={ref}
    item={true}
    className={className}
    style={style}
    onFocus={onFocus}
    xs={n(phoneColumns || columns || FULL_ROW)}
    sm={n(phoneColumns || columns || FULL_ROW)}
    md={n(tabletColumns || columns || FULL_ROW)}
    lg={n(desktopColumns || tabletColumns || columns || FULL_ROW)}
    xl={n(desktopColumns || columns || FULL_ROW)}
  >
    <Box
      mr={n(fieldRightMargin)}
      mb={n(fieldBottomMargin)}
    >
      {children}
    </Box>
  </Grid>
);

Item.displayName = 'Item';

export default forwardRef(Item);
