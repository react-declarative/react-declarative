import * as React from "react";

import { makeStyles } from "@material-ui/core";

import Group, { IGroupProps } from "../components/Group";

import classNames from "../utils/classNames";

import IAnything from "../model/IAnything";

export interface IGroupLayoutProps<Data = IAnything> extends IGroupProps<Data> {}

interface IGroupLayoutPrivate {
  children: React.ReactChild;
}

const useStyles = makeStyles({
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

export const GroupLayout = <Data extends IAnything = IAnything>({
  columns,
  phoneColumns,
  tabletColumns,
  desktopColumns,
  fieldRightMargin,
  fieldBottomMargin,
  style,
  className,
  children,
}: IGroupLayoutProps<Data> & IGroupLayoutPrivate) => {
    const classes = useStyles();
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
            <Group className={classes.content}>
                {children}
            </Group>
        </Group>
    );
};

GroupLayout.displayName = 'GroupLayout';

export default GroupLayout;
