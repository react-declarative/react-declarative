import * as React from "react";

import { makeStyles } from "@material-ui/core";

import Group, { IGroupProps } from "../components/Group";
import Paper, { IPaperProps } from '../components/Paper';

import classNames from "../utils/classNames";

export interface IPaperLayoutProps extends IPaperProps, IGroupProps {}

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

export const PaperLayout = ({
  columns,
  phoneColumns,
  tabletColumns,
  desktopColumns,
  fieldRightMargin,
  fieldBottomMargin,
  style,
  className,
  children,
}: IPaperLayoutProps & IPaperLayoutPrivate) => {
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
