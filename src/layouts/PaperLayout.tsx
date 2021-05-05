import * as React from "react";

import { makeStyles } from "@material-ui/core";

import Group, { IGroupProps } from "../components/common/Group";
import Paper, { IPaperProps } from '../components/common/Paper';

import classNames from "../utils/classNames";

import IAnything from "../model/IAnything";

export interface IPaperLayoutProps<Data = IAnything> extends IPaperProps<Data>, IGroupProps<Data> {}

interface IPaperLayoutPrivate {
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

export const PaperLayout = <Data extends IAnything = IAnything>({
  columns,
  phoneColumns,
  tabletColumns,
  desktopColumns,
  fieldRightMargin,
  fieldBottomMargin,
  style,
  className,
  children,
}: IPaperLayoutProps<Data> & IPaperLayoutPrivate) => {
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
            <Paper className={classes.content}>
                {children}
            </Paper>
        </Group>
    );
};

PaperLayout.displayName = 'PaperLayout';

export default PaperLayout;
