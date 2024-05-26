import * as React from "react";

import { makeStyles } from "../../../styles";
import { alpha } from "@mui/material";

import Expansion, { IExpansionProps } from "../../common/Expansion";
import Group, { IGroupProps } from "../../common/Group";

import classNames from '../../../utils/classNames';

import IAnything from "../../../model/IAnything";

import makeLayout from "../components/makeLayout/makeLayout";

/**
 * Represents the properties for an Expansion Layout component.
 * @template Data - The data type for the expansion layout.
 * @template Payload - The payload type for the expansion layout.
 */
export interface IExpansionLayoutProps<Data = IAnything, Payload = IAnything> extends IExpansionProps<Data, Payload>, IGroupProps<Data, Payload> {}

/**
 * Represents the private configuration options for an Expansion Layout.
 *
 * @interface IExpansionLayoutPrivate
 */
interface IExpansionLayoutPrivate {
  isBaselineAlign: boolean;
  outlinePaper: boolean;
  transparentPaper: boolean;
  children?: React.ReactNode;
}

/**
 * useStyles is a function that returns an object of CSS classes generated using the makeStyles() function from the Material-UI library.
 *
 * The returned object contains CSS classes for different elements and components, such as the root, content, outlinePaper, and transparentPaper.
 * These classes can be used to apply styling and layout to the corresponding elements in a React component.
 *
 * @returns An object containing CSS classes for different elements and components.
 */
const useStyles = makeStyles()((theme) => ({
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
  outlinePaper: {
    background: 'transparent',
    boxShadow: 'none !important',
    border: `1px solid ${alpha(theme.palette.getContrastText(theme.palette.background.default), 0.23)}`,
    borderRadius: '4px',
  },
  transparentPaper: {
    background: 'transparent',
  }
}));

/**
 * Renders an ExpansionLayout component.
 *
 * @template Data - The type of data to be used.
 *
 * @param props - The props for the ExpansionLayout component.
 * @param props.columns - The number of columns for the Group component.
 * @param props.columnsOverride - The number of columns to override the Group's columns prop.
 * @param props.sx - The style for the ExpansionLayout component.
 * @param props.phoneColumns - The number of columns to use on phone devices.
 * @param props.tabletColumns - The number of columns to use on tablet devices.
 * @param props.desktopColumns - The number of columns to use on desktop devices.
 * @param props.isBaselineAlign - A boolean value indicating whether to align items to the baseline.
 * @param [props.fieldRightMargin='0'] - The right margin for the fields within the Group component.
 * @param [props.fieldBottomMargin='0'] - The bottom margin for the fields within the Group component.
 * @param props.style - The style object for the ExpansionLayout component.
 * @param props.className - The class name for the ExpansionLayout component.
 * @param props.children - The children for the ExpansionLayout component.
 * @param props.title - The title for the Expansion component.
 * @param props.description - The description for the Expansion component.
 * @param props.expansionOpened - A boolean value indicating whether the Expansion should be opened.
 * @param props.outlinePaper - A boolean value indicating whether to show an outline paper style for the Expansion.
 * @param props.transparentPaper - A boolean value indicating whether to show a transparent paper style for the Expansion.
 *
 * @returns - The rendered ExpansionLayout component.
 */
export const ExpansionLayout = <Data extends IAnything = IAnything>({
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
  title,
  testId,
  description,
  expansionOpened,
  outlinePaper,
  transparentPaper,
}: IExpansionLayoutProps<Data> & IExpansionLayoutPrivate) => {
    const { classes } = useStyles();
    return (
        <Group
            className={classNames(className, classes.root)}
            data-testid={testId}
            style={style}
            sx={sx}
            isItem={true}
            columns={columns}
            phoneColumns={phoneColumns}
            tabletColumns={tabletColumns}
            desktopColumns={desktopColumns}
            fieldRightMargin={fieldRightMargin}
            fieldBottomMargin={fieldBottomMargin}
        >
            <Expansion 
                className={classNames(classes.content, {
                  [classes.outlinePaper]: outlinePaper && !transparentPaper,
                  [classes.transparentPaper]: !outlinePaper && transparentPaper,
                })}
                columnsOverride={columnsOverride}
                expansionOpened={expansionOpened}
                title={title}
                isBaselineAlign={isBaselineAlign}
                description={description}
            >
                {children}
            </Expansion>
        </Group>
    );
};

ExpansionLayout.displayName = 'ExpansionLayout';

export default makeLayout(ExpansionLayout) as typeof ExpansionLayout;
