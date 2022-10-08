import * as React from 'react';
import { useState, useMemo } from 'react';

import { makeStyles } from "../../../styles";
import { alpha } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import classNames from "../../../utils/classNames";

import Group, { IGroupProps } from "../../../components/common/Group";

import IField from '../../../model/IField';
import IEntity from '../../../model/IEntity';
import IAnything from '../../../model/IAnything';
import { PickProp } from '../../../model/IManaged';

export interface ITabsLayoutProps<Data = IAnything> extends IGroupProps<Data> {
    className?: PickProp<IField<Data>, 'className'>;
    style?: PickProp<IField<Data>, 'style'>;
    tabLine?: PickProp<IField<Data>, 'tabLine'>;
    tabList?: PickProp<IField<Data>, 'tabList'>;
    tabIndex?: PickProp<IField<Data>, 'tabIndex'>;
    tabColor?: PickProp<IField<Data>, 'tabColor'>;
    tabChange?: PickProp<IField<Data>, 'tabChange'>;
    tabVariant?: PickProp<IField<Data>, 'tabVariant'>;
    tabKeepFlow?: PickProp<IField<Data>, 'tabKeepFlow'>;
    tabBackground?: PickProp<IField<Data>, 'tabBackground'>;
}

const TABS_SELECTOR = 'react-declarative__tabsLayoutHeader';

interface ITabsLayoutPrivate<Data = IAnything> extends IEntity<Data> {
    children: React.ReactNode;
}

const useStyles = makeStyles()((theme) => ({
    root: {
        position: 'relative',
        display: "flex",
        alignItems: "stretch",
        justifyContent: "stretch",
        overflow: "hidden",
        '& > *': {
            flex: 1,
        },
    },
    keepFlow: {
        overflow: "initial !important",
        '& $container': {
            position: 'static !important' as any,
        },
        '& $content': {
            overflow: 'hidden !important' as any,
        },
    },
    minSize: {
        minWidth: 225,
        minHeight: 225,
    },
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "stretch",
        justifyContent: "stretch",
        flexDirection: 'column',
        '& > *': {
            flex: 1,
        },
    },
    tabs: {
        maxHeight: 48,
    },
    content: {
        display: "flex",
        alignItems: "stretch",
        justifyContent: "stretch",
        flexDirection: 'column',
        overflowY: 'auto',
        '& > *': {
            flex: 1,
        },
    },
    line: {
        background: alpha(theme.palette.getContrastText(theme.palette.background.default), 0.23),
        maxHeight: 2,
        marginTop: -2,
    },
    background: {
        background: alpha('#000', 0.05),
    },
}));

export const TabsLayout = <Data extends IAnything = IAnything>({
    children,
    className,
    style,
    tabChange,
    tabVariant = "fullWidth",
    tabLine = false,
    tabColor = "primary",
    tabList = ["Empty"],
    tabKeepFlow = false,
    tabBackground = false,
    tabIndex: tabIndexDefault = 0,
    columns,
    columnsOverride,
    sx,
    phoneColumns,
    tabletColumns,
    desktopColumns,
    fieldRightMargin = '0',
    fieldBottomMargin = '0',
}: ITabsLayoutProps<Data> & ITabsLayoutPrivate<Data>) => {
    const { classes } = useStyles();
    const [tabIndex, setTabIndex] = useState(tabIndexDefault);
    const handleTabChange = (_: unknown, tabIndex: number) => {
        tabChange && tabChange(tabIndex);
        setTabIndex(tabIndex);
    };
    const contentSx = useMemo(() => Array(tabList.length).fill({}).reduce((acm, {}, idx) => ({
        [`& > *:nth-of-type(${idx + 1})`]: {
            display: tabIndex === idx ? 'inherit' : 'none !important',
        },
        ...acm,
    }), {}), [tabIndex]);
    return (
        <Group
            className={className}
            style={style}
            isItem={true}
            columns={columns}
            columnsOverride={columnsOverride}
            phoneColumns={phoneColumns}
            tabletColumns={tabletColumns}
            desktopColumns={desktopColumns}
            fieldRightMargin={fieldRightMargin}
            fieldBottomMargin={fieldBottomMargin}
            sx={sx}
        >
            <Box className={classNames(classes.root, {
                [classes.keepFlow]: tabKeepFlow,
                [classes.minSize]: !tabKeepFlow,
            })}>
                <Box className={classes.container}>
                    <Tabs
                        value={tabIndex}
                        indicatorColor={tabColor}
                        textColor={tabColor}
                        variant={tabVariant}
                        onChange={handleTabChange}
                        className={classNames(classes.tabs, TABS_SELECTOR)}
                    >
                        {tabList.map((label, idx) => (
                            <Tab
                                key={idx}
                                label={label}
                            />
                        ))}
                    </Tabs>
                    {tabLine && (
                        <Box className={classes.line} />
                    )}
                    <Box
                        className={classNames(classes.content, {
                            [classes.background]: tabBackground,
                        })}
                        sx={contentSx}
                    >
                        {children}
                    </Box>
                </Box>
            </Box>
        </Group>
    );
};

TabsLayout.displayName = 'TabsLayout';

export default TabsLayout;
