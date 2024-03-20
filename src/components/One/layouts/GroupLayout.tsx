import * as React from "react";

import { makeStyles } from "../../../styles";

import Group, { IGroupProps } from "../../../components/common/Group";

import classNames from "../../../utils/classNames";

import IAnything from "../../../model/IAnything";

import makeLayout from "../components/makeLayout/makeLayout";

/**
 * Interface for defining the props of GroupLayout component.
 *
 * @template Data - The type of data associated with the group.
 * @template Payload - The type of payload associated with the group.
 */
export interface IGroupLayoutProps<Data = IAnything, Payload = IAnything> extends IGroupProps<Data, Payload> {}

/**
 * Represents the private interface for the GroupLayout class.
 *
 * @interface
 */
interface IGroupLayoutPrivate {
  isBaselineAlign: boolean;
  children?: React.ReactNode;
}

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
 * Represents a layout component used for grouping and organizing child components.
 *
 * @template Data - The type of data passed to the component.
 * @param props - The props to configure the GroupLayout component.
 * @param props.columns - The number of columns for the component.
 * @param props.columnsOverride - The number of columns to override for specific items.
 * @param props.sx - The sx value to pass to the component.
 * @param props.phoneColumns - The number of phone columns for the component.
 * @param props.tabletColumns - The number of tablet columns for the component.
 * @param props.desktopColumns - The number of desktop columns for the component.
 * @param props.isBaselineAlign - Indicates whether the items should be baseline aligned.
 * @param [props.fieldRightMargin='0'] - The right margin value for fields.
 * @param [props.fieldBottomMargin='0'] - The bottom margin value for fields.
 * @param [props.style] - The inline style object for the component.
 * @param [props.className] - The CSS class for the component.
 * @param props.children - The child components to be rendered.
 * @returns The rendered GroupLayout component.
 */
export const GroupLayout = <Data extends IAnything = IAnything>({
  columns,
  columnsOverride,
  sx,
  phoneColumns,
  tabletColumns,
  desktopColumns,
  isBaselineAlign,
  fieldRightMargin = '0',
  fieldBottomMargin = '0',
  style,
  className,
  children,
}: IGroupLayoutProps<Data> & IGroupLayoutPrivate) => {
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
          <Group
            className={classes.content}
            isBaselineAlign={isBaselineAlign}
            columnsOverride={columnsOverride}
            sx={sx}
          >
            {children}
          </Group>
        </Group>
    );
};

GroupLayout.displayName = 'GroupLayout';

export default makeLayout(GroupLayout) as typeof GroupLayout;
