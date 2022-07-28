import * as React from "react";

import { makeStyles } from "../../../styles";

import Expansion, { IExpansionProps } from "../../common/Expansion";
import Group, { IGroupProps } from "../../common/Group";

import classNames from '../../../utils/classNames';

import IAnything from "../../../model/IAnything";

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
  columnsOverride,
  sx,
  phoneColumns,
  tabletColumns,
  desktopColumns,
  fieldRightMargin = '0',
  fieldBottomMargin = '0',
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
                columnsOverride={columnsOverride}
                sx={sx}
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
