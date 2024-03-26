import * as React from "react";
import { forwardRef } from "react";

import { makeStyles } from "../../../styles";

import { IManagedLayout, PickProp } from "../../../model/IManaged";
import IAnything from "../../../model/IAnything";
import IField from "../../../model/IField";

import classNames from '../../../utils/classNames';

import Item from "./Item";
import Container from "./Container";

/**
 * Represents the props for a group component.
 *
 * @template Data - The type of data accepted by the group component.
 * @template Payload - The type of payload used by the group component.
 * @extends IManagedLayout - Inherit props from IManagedLayout.
 */
export interface IGroupProps<Data = IAnything, Payload = IAnything> extends IManagedLayout<Data, Payload> {
  style?: PickProp<IField<Data, Payload>, 'style'>;
  className?: PickProp<IField<Data, Payload>, 'className'>;
}

/**
 * Represents a private interface for a group component.
 *
 * @interface IGroupPrivate
 */
interface IGroupPrivate {
  children: React.ReactNode;
  isItem?: boolean;
  isBaselineAlign?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onFocus?: () => void;
  onContextMenu?: React.MouseEventHandler<HTMLDivElement>;
}

/**
 * Returns the styles for a component.
 *
 * @function useStyles
 * @returns {Object} The styles for a component.
 */
const useStyles = makeStyles()({
  root: {
    position: "relative",
    '& > *': {
      width: '100%',
    },
  },
});

/**
 * Group component
 *
 * @typedef {Object} Group
 * @property {string} className - The class name of the group
 * @property {string} columns - The columns property of the group
 * @property {string} phoneColumns - The phone columns property of the group
 * @property {string} tabletColumns - The tablet columns property of the group
 * @property {string} desktopColumns - The desktop columns property of the group
 * @property {React.ReactNode} children - The children of the group
 * @property {boolean} isItem - Whether the group is an item
 * @property {boolean} isBaselineAlign - Whether to align the group baseline
 * @property {object} style - The style object of the group
 * @property {string} columnsOverride - The columns override property of the group
 * @property {string} sx - The sx property of the group
 * @property {string} fieldRightMargin - The right margin of the field
 * @property {string} fieldBottomMargin - The bottom margin of the field
 * @property {function} onClick - The onClick event handler of the group
 * @property {function} onFocus - The onFocus event handler of the group
 * @property {function} onContextMenu - The onContextMenu event handler of the group
 * @property {Object} ...otherProps - Other props passed to the group
 * @property {React.Ref<HTMLDivElement>} ref - The ref of the group
 *
 * @param Group - The Group component function
 * @returns The rendered component
 */
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
