import * as React from 'react';
import { useState } from 'react';

import { makeStyles } from "@mui/styles";

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import classNames from "../utils/classNames";

import IField from '../model/IField';
import IEntity from '../model/IEntity';
import IAnything from '../model/IAnything';
import { PickProp } from '../model/IManaged';

export interface ITabsLayoutProps<Data = IAnything> {
    className?: PickProp<IField<Data>, 'className'>;
    style?: PickProp<IField<Data>, 'style'>;
    tabList?: PickProp<IField<Data>, 'tabList'>;
    tabIndex?: PickProp<IField<Data>, 'tabIndex'>;
    tabColor?: PickProp<IField<Data>, 'tabColor'>;
    tabVariant?: PickProp<IField<Data>, 'tabVariant'>;
    tabKeepFlow?: PickProp<IField<Data>, 'tabKeepFlow'>;
}

const TABS_SELECTOR = 'react-declarative__tabsLayoutHeader';

interface ITabsLayoutPrivate<Data = IAnything> extends IEntity<Data> {
    children: React.ReactChild;
}

const createTabHidden = (idx: number) => ({
    [`& > *:nth-child(${idx + 1})`]: {
        display: 'none !important',
    },
});

const useStyles = makeStyles({
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
            position: 'static !important',
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
    },
    hideTabIndex0: createTabHidden(0),
    hideTabIndex1: createTabHidden(1),
    hideTabIndex2: createTabHidden(2),
    hideTabIndex3: createTabHidden(3),
    hideTabIndex4: createTabHidden(4),
});

export const TabsLayout = <Data extends IAnything = IAnything>({
    children,
    className,
    style,
    tabVariant = "fullWidth",
    tabColor = "primary",
    tabList = ["Empty"],
    tabKeepFlow = false,
    tabIndex: tabIndexDefault = 0,
}: ITabsLayoutProps<Data> & ITabsLayoutPrivate<Data>) => {
    const classes = useStyles();
    const [tabIndex, setTabIndex] = useState(tabIndexDefault);
    const handleTabChange = (_: unknown, tabIndex: number) => setTabIndex(tabIndex);
    return (
        <Box className={classNames(className, classes.root, {
            [classes.keepFlow]: tabKeepFlow,
            [classes.minSize]: !tabKeepFlow,
        })} style={style}>
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
                <Box className={classNames(classes.content, {
                    [classes.hideTabIndex0]: tabIndex !== 0,
                    [classes.hideTabIndex1]: tabIndex !== 1,
                    [classes.hideTabIndex2]: tabIndex !== 2,
                    [classes.hideTabIndex3]: tabIndex !== 3,
                    [classes.hideTabIndex4]: tabIndex !== 4,
                })}>
                    {children}
                </Box>
            </Box>
        </Box>
    );
};

TabsLayout.displayName = 'TabsLayout';

export default TabsLayout;
