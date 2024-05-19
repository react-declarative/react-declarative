import * as React from "react";

import { makeStyles } from "../../../styles";

import Group, { IGroupProps } from "../../../components/common/Group";
import Outline, { IOutlineProps } from '../../../components/common/Outline';
import BaselineAdjust from "../components/common/BaselineAdjust";

import classNames from "../../../utils/classNames";

import { PickProp } from "../../../model/IManaged";
import IAnything from "../../../model/IAnything";
import IField from "../../../model/IField";

import makeLayout from "../components/makeLayout/makeLayout";

/**
 * Represents the props for the OutlineLayout component.
 *
 * @template Data - The type of data for the outline.
 * @template Payload - The type of payload for the outline.
 *
 * @extends {IOutlineProps<Data, Payload>} - The props required for the Outline component.
 * @extends {IGroupProps<Data, Payload>} - The props required for the Group component.
 */
export interface IOutlineLayoutProps<Data = IAnything, Payload = IAnything> extends IOutlineProps<Data, Payload>, IGroupProps<Data, Payload> {
  innerPadding?: PickProp<IField<Data, Payload>, 'innerPadding'>;
}

/**
 * Represents the private interface for the OutlineLayout class.
 * @interface IOutlineLayoutPrivate
 */
interface IOutlineLayoutPrivate {
  isBaselineAlign: boolean;
  children?: React.ReactNode;
}

/**
 * A function that generates and returns the styles object for a component.
 *
 * @function
 * @returns The styles object for the component.
 *
 */
const useStyles = makeStyles()({
  root: {
    position: "relative",
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
  },
  content: {
    flexGrow: 1,
    width: "100%",
  },
});

/**
 * Represents the OutlineLayout component.
 *
 * @param props - The props for the OutlineLayout component.
 * @param props.columns - The number of columns.
 * @param props.columnsOverride - The number of columns to override.
 * @param props.sx - The custom inline styles.
 * @param props.phoneColumns - The number of columns for phone devices.
 * @param props.tabletColumns - The number of columns for tablet devices.
 * @param props.desktopColumns - The number of columns for desktop devices.
 * @param props.style - The custom styles.
 * @param props.className - The class name.
 * @param props.children - The child components.
 * @param props.isBaselineAlign - Indicates whether the items should be baseline aligned.
 * @param props.fieldRightMargin - The right margin for fields.
 * @param props.fieldBottomMargin - The bottom margin for fields.
 * @param props.innerPadding - The inner padding.
 * @returns The OutlineLayout component.
 */
export const OutlineLayout = <Data extends IAnything = IAnything>({
  columns,
  columnsOverride,
  sx,
  phoneColumns,
  tabletColumns,
  desktopColumns,
  style,
  className,
  children,
  isBaselineAlign,
  fieldRightMargin = '0',
  fieldBottomMargin = '0',
  innerPadding: padding = '18px',
}: IOutlineLayoutProps<Data> & IOutlineLayoutPrivate) => {
  const { classes } = useStyles();
  return (
    <Group
      className={classNames(className, classes.root)}
      style={style}
      isItem={true}
      columns={columns}
      phoneColumns={phoneColumns}
      tabletColumns={tabletColumns}
      desktopColumns={desktopColumns}
      fieldRightMargin={fieldRightMargin}
      fieldBottomMargin={fieldBottomMargin}
    >
      <Outline
        className={classes.content}
        isBaselineAlign={isBaselineAlign}
        columnsOverride={columnsOverride}
        style={{ padding }}
        sx={sx}
      >
        {children}
        <BaselineAdjust />
      </Outline>
    </Group>
  );
};

OutlineLayout.displayName = 'OutlineLayout';

export default makeLayout(OutlineLayout) as typeof OutlineLayout;
