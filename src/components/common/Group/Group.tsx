import * as React from "react";
import { forwardRef } from "react";

import { makeStyles } from "../../../styles";

import { IManagedLayout, PickProp } from "../../../model/IManaged";
import IAnything from "../../../model/IAnything";
import IField from "../../../model/IField";

import classNames from '../../../utils/classNames';

import Item from "./Item";
import Container from "./Container";

export interface IGroupProps<Data = IAnything, Payload = IAnything> extends IManagedLayout<Data, Payload> {
  style?: PickProp<IField<Data, Payload>, 'style'>;
  className?: PickProp<IField<Data, Payload>, 'className'>;
}

interface IGroupPrivate {
  children: React.ReactNode;
  isItem?: boolean;
  isBaselineAlign?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onFocus?: () => void;
  onContextMenu?: React.MouseEventHandler<HTMLDivElement>;
}

const useStyles = makeStyles()({
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
    isItem,
    isBaselineAlign,
    style,
    columnsOverride,
    sx,
    fieldRightMargin = '1',
    fieldBottomMargin = '2',
    onClick,
    onFocus,
    onContextMenu,
    ...otherProps
  }: IGroupProps & IGroupPrivate,
  ref: React.Ref<HTMLDivElement>
) => {
  const { classes } = useStyles();
  if (isItem) {
    return (
      <Item
        {...otherProps}
        ref={ref}
        className={classNames(classes.root, className)}
        style={style}
        columns={columns}
        phoneColumns={phoneColumns}
        tabletColumns={tabletColumns}
        desktopColumns={desktopColumns}
        fieldRightMargin={fieldRightMargin}
        fieldBottomMargin={fieldBottomMargin}
        onFocus={onFocus}
        onClick={onClick}
        onContextMenu={onContextMenu}
        sx={sx}
      >
        {children}
      </Item>
    );
  } else {
    return (
      <Container
        {...otherProps}
        ref={ref}
        className={classNames(classes.root, className)}
        isBaselineAlign={isBaselineAlign}
        columnsOverride={columnsOverride}
        style={style}
        onFocus={onFocus}
        onContextMenu={onContextMenu}
        onClick={onClick}
        sx={sx}
      >
        {children}
      </Container>
    );
  }
};

Group.displayName = 'Group';

export default forwardRef(Group);
