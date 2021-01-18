import * as React from "react";
import { createElement as h, forwardRef } from "react";

import { Grid, Box } from "@material-ui/core";

import { IManagedLayout } from "../../model/IManaged";

type nums = keyof {
    1: never;
    2: never;
    3: never;
    4: never;
    5: never;
    6: never;
    7: never;
    8: never;
    9: never;
    10: never;
    11: never;
    12: never;
}

const n = (v: string)=> Number(v) as nums;
const FULL_ROW = "12";

const gridProps = (isItem: boolean) => {
  if (isItem) {
    return { spacing: 3, item: true };
  } else {
    return { container: true };
  }
};

const renderItem = (
  isItem: boolean,
  children: React.ReactChild,
  mr: number,
  mb: number
) => {
  if (isItem) {
    return h(Box, { mr, mb }, children);
  } else {
    return children;
  }
};

export interface IGroupProps extends IManagedLayout {
    style?: React.CSSProperties;
    className?: string;
}

interface IGroupPrivate {
    children: React.ReactChild;
    isItem?: boolean;
    onFocus?: () => void;
}

export const Group = (
  {
    className = "",
    columns = "",
    phoneColumns = "",
    tabletColumns = "",
    desktopColumns = "",
    children,
    isItem = false,
    style,
    fieldRightMargin = 1,
    fieldBottomMargin = 2,
    ...otherProps
  }: IGroupProps & IGroupPrivate,
  ref: React.Ref<HTMLDivElement>
) => (
  <Grid
    ref={ref}
    alignItems="flex-start"
    {...otherProps}
    {...gridProps(isItem)}
    xs={n(phoneColumns || columns || FULL_ROW)}
    sm={n(phoneColumns || columns || FULL_ROW)}
    md={n(tabletColumns || columns || FULL_ROW)}
    lg={n(tabletColumns || desktopColumns || columns || FULL_ROW)}
    xl={n(desktopColumns || columns || FULL_ROW)}
    spacing={0}
    className={className}
    style={style}
  >
    {renderItem(isItem, children, fieldRightMargin, fieldBottomMargin)}
  </Grid>
);

export default forwardRef(Group);
