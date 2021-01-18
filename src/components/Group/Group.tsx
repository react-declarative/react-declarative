import * as React from "react";
import { createElement as h, forwardRef } from "react";

import { Grid, Box, makeStyles } from "@material-ui/core";

import { IManagedLayout, PickProp } from "../../model/IManaged";
import IField from "../../model/IField";

import classNames from '../../utils/classNames';

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
};

type align = keyof {
  "flex-start": never,
};

const n = (v: string)=> Number(v) as nums;
const FULL_ROW = "12";

const gridProps = (
  isItem: boolean,
  columns: string,
  phoneColumns: string,
  tabletColumns: string,
  desktopColumns: string,
) => {
  if (isItem) {
    return {
      item: true,
      xs: n(phoneColumns || columns || FULL_ROW),
      sm: n(phoneColumns || columns || FULL_ROW),
      md: n(tabletColumns || columns || FULL_ROW),
      lg: n(desktopColumns || tabletColumns || columns || FULL_ROW),
      xl: n(desktopColumns || columns || FULL_ROW),
    };
  } else {
    return {
      container: true,
      alignItems: "flex-start" as align,
    };
  }
};

const renderItem = (
  isItem: boolean,
  children: React.ReactChild,
  mr: number,
  mb: number
): React.ReactChild => {
  if (isItem) {
    return h(Box, { mr, mb }, children);
  } else {
    return children;
  }
};

export interface IGroupProps extends IManagedLayout {
    style?: PickProp<IField, 'style'>;
    className?: PickProp<IField, 'className'>;
}

interface IGroupPrivate {
    children: React.ReactChild;
    isItem?: boolean;
    onFocus?: () => void;
}

const useStyles = makeStyles({
  root: {
    position: "relative",
    '& > *': {
      width: '100%',
    },
  },
});

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
    fieldRightMargin = '1',
    fieldBottomMargin = '2',
    onFocus,
    ...otherProps
  }: IGroupProps & IGroupPrivate,
  ref: React.Ref<HTMLDivElement>
) => {
  const classes = useStyles();
  return (
    <Grid
      ref={ref}
      onFocus={onFocus}
      {...gridProps(isItem, columns, phoneColumns, tabletColumns, desktopColumns)}
      {...otherProps}
      className={classNames(className, classes.root)}
      style={style}
    >
      {renderItem(isItem, children, n(fieldRightMargin), n(fieldBottomMargin))}
    </Grid>
  );
};

Group.displayName = 'Group';

export default forwardRef(Group);
