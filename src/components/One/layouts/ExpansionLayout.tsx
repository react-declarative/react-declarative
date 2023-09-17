import * as React from "react";

import { makeStyles } from "../../../styles";
import { alpha } from "@mui/material";

import Expansion, { IExpansionProps } from "../../common/Expansion";
import Group, { IGroupProps } from "../../common/Group";

import classNames from '../../../utils/classNames';

import IAnything from "../../../model/IAnything";

import makeLayout from "../components/makeLayout/makeLayout";

export interface IExpansionLayoutProps<Data = IAnything, Payload = IAnything> extends IExpansionProps<Data, Payload>, IGroupProps<Data, Payload> {}

interface IExpansionLayoutPrivate {
  isBaselineAlign: boolean;
  outlinePaper: boolean;
  children?: React.ReactNode;
}

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
  }
}));

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
  description,
  expansionOpened,
  outlinePaper,
}: IExpansionLayoutProps<Data> & IExpansionLayoutPrivate) => {
    const { classes } = useStyles();
    return (
        <Group
            className={classNames(className, classes.root, {
              [classes.outlinePaper]: outlinePaper,
            })}
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
                expansionOpened={expansionOpened}
                sx={sx}
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
