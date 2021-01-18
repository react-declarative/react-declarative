import * as React from "react";

import { makeStyles } from "@material-ui/core";

import Group, { IGroupProps } from "../components/Group";

import classNames from "../utils/classNames";

export interface IGroupLayoutProps extends IGroupProps {}

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

export const GroupLayout = ({
  columns,
  phoneColumns,
  tabletColumns,
  desktopColumns,
  fieldRightMargin,
  fieldBottomMargin,
  style,
  className,
  children,
}: IGroupLayoutProps & IGroupLayoutPrivate) => {
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

export default GroupLayout;
