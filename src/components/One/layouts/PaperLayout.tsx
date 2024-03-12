import * as React from "react";
import { createElement } from "react";

import { makeStyles } from "../../../styles";

import Group, { IGroupProps } from "../../../components/common/Group";
import Paper, { IPaperProps } from "../../../components/common/Paper";

import Outline from "../../../components/common/Outline";
import Blank from "../../common/Blank";

import classNames from "../../../utils/classNames";

import { PickProp } from "../../../model/IManaged";
import IAnything from "../../../model/IAnything";
import IField from "../../../model/IField";

import makeLayout from "../components/makeLayout/makeLayout";

export interface IPaperLayoutProps<Data = IAnything, Payload = IAnything>
  extends IPaperProps<Data, Payload>,
    IGroupProps<Data, Payload> {
  innerPadding?: PickProp<IField<Data, Payload>, "innerPadding">;
  outlinePaper?: PickProp<IField<Data, Payload>, "outlinePaper">;
  transparentPaper?: PickProp<IField<Data, Payload>, "transparentPaper">;
}

interface IPaperLayoutPrivate {
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
 * Renders a paper layout component.
 *
 * @template Data - The type of data to be used.
 * @param props - The props object.
 * @param [props.columns] - The number of columns to display.
 * @param [props.columnsOverride] - The number of columns to override the default value.
 * @param [props.phoneColumns] - The number of columns to display on phones.
 * @param [props.tabletColumns] - The number of columns to display on tablets.
 * @param [props.desktopColumns] - The number of columns to display on desktops.
 * @param [props.style] - The CSS styles to be applied.
 * @param [props.className] - The class name to be applied.
 * @param [props.children] - The children components to be rendered.
 * @param [props.isBaselineAlign] - Determines if items should be aligned to the baseline.
 * @param [props.fieldRightMargin="0"] - The right margin of each field.
 * @param [props.fieldBottomMargin="0"] - The bottom margin of each field.
 * @param [props.innerPadding="18px"] - The inner padding of the paper layout.
 * @param [props.outlinePaper=false] - Determines if the paper should have an outline.
 * @param [props.transparentPaper=false] - Determines if the paper should be transparent.
 * @returns - The rendered paper layout component.
 */
export const PaperLayout = <Data extends IAnything = IAnything>({
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
  fieldRightMargin = "0",
  fieldBottomMargin = "0",
  innerPadding: padding = "18px",
  outlinePaper = false,
  transparentPaper = false,
}: IPaperLayoutProps<Data> & IPaperLayoutPrivate) => {
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
      {createElement(
        transparentPaper ? Blank : outlinePaper ? Outline : Paper,
        {
          className: classes.content,
          columnsOverride: columnsOverride,
          isBaselineAlign,
          sx,
          style: { padding },
          children,
        },
      )}
    </Group>
  );
};

PaperLayout.displayName = "PaperLayout";

export default makeLayout(PaperLayout) as typeof PaperLayout;
