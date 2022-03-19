import * as React from "react";
import { forwardRef } from "react";

import { makeStyles } from "../../../styles";

import { IManagedLayout, PickProp } from "../../../model/IManaged";
import IAnything from "../../../model/IAnything";
import IField from "../../../model/IField";

import classNames from '../../../utils/classNames';

import Item from "./Item";
import Container from "./Container";

export interface IGroupProps<Data = IAnything> extends IManagedLayout {
  style?: PickProp<IField<Data>, 'style'>;
  className?: PickProp<IField<Data>, 'className'>;
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
    columnsOverride = '12',
    fieldRightMargin = '1',
    fieldBottomMargin = '2',
    onFocus,
  }: IGroupProps & IGroupPrivate,
  ref: React.Ref<HTMLDivElement>
) => {
  const classes = useStyles();
  if (isItem) {
    return (
      <Item
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
      >
        {children}
      </Item>
    );
  } else {
    return (
      <Container
        ref={ref}
        className={classNames(classes.root, className)}
        columnsOverride={columnsOverride}
        style={style}
        onFocus={onFocus}
      >
        {children}
      </Container>
    );
  }
};

Group.displayName = 'Group';

export default forwardRef(Group);
