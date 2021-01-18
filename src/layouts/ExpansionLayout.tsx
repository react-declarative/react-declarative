import * as React from "react";

import { makeStyles } from "@material-ui/core";

import Expansion, { IExpansionProps } from "../components/Expansion";
import Group, { IGroupProps } from "../components/Group";

import classNames from '../utils/classNames';

export interface IExpansionLayoutProps extends IExpansionProps, IGroupProps {}

interface IExpansionLayoutPrivate {
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

export const ExpansionLayout = ({
  columns,
  phoneColumns,
  tabletColumns,
  desktopColumns,
  fieldRightMargin,
  fieldBottomMargin,
  style,
  className,
  children,
  title,
  description,
}: IExpansionLayoutProps & IExpansionLayoutPrivate) => {
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
            <Expansion 
                className={classes.content}
                title={title}
                description={description}
            >
                {children}
            </Expansion>
        </Group>
    );
};

ExpansionLayout.displayName = 'ExpansionLayout';

export default ExpansionLayout;
