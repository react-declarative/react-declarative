import * as React from "react";
import { forwardRef } from "react";

import { makeStyles } from "@material-ui/core";

import { IManagedLayout, PickProp } from "../../model/IManaged";
import IField from "../../model/IField";

import classNames from '../../utils/classNames';

import Item from "./Item";
import Container from "./Container";

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
