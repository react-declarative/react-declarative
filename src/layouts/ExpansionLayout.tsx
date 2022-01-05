import * as React from "react";

import { makeStyles } from "@mui/styles";

import Expansion, { IExpansionProps } from "../components/common/Expansion";
import Group, { IGroupProps } from "../components/common/Group";

import classNames from '../utils/classNames';

import IAnything from "../model/IAnything";

export interface IExpansionLayoutProps<Data = IAnything> extends IExpansionProps<Data>, IGroupProps<Data> {}

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

export const ExpansionLayout = <Data extends IAnything = IAnything>({
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
}: IExpansionLayoutProps<Data> & IExpansionLayoutPrivate) => {
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
