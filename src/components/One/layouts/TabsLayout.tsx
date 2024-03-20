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

import makeLayout from '../components/makeLayout/makeLayout';

/**
 * Interface representing the props for the ITabsLayout component.
 */
export interface ITabsLayoutProps<Data = IAnything, Payload = IAnything> extends IGroupProps<Data, Payload> {
    className?: PickProp<IField<Data, Payload>, 'className'>;
    style?: PickProp<IField<Data, Payload>, 'style'>;
    tabLine?: PickProp<IField<Data, Payload>, 'tabLine'>;
    tabList?: PickProp<IField<Data, Payload>, 'tabList'>;
    tabIndex?: PickProp<IField<Data, Payload>, 'tabIndex'>;
    tabColor?: PickProp<IField<Data, Payload>, 'tabColor'>;
    tabChange?: PickProp<IField<Data, Payload>, 'tabChange'>;
    tabVariant?: PickProp<IField<Data, Payload>, 'tabVariant'>;
    tabKeepFlow?: PickProp<IField<Data, Payload>, 'tabKeepFlow'>;
    tabBackground?: PickProp<IField<Data, Payload>, 'tabBackground'>;
}

const TABS_SELECTOR = 'react-declarative__tabsLayoutHeader';

/**
 * Represents a private interface for `ITabsLayout`.
 *
 * @template Data - The type of data associated with the entity.
 */
interface ITabsLayoutPrivate<Data = IAnything> extends IEntity<Data> {
    isBaselineAlign: boolean;
    children?: React.ReactNode;
}

const useStyles = makeStyles()((theme, _, classes) => ({
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
        [`& .${classes["container"]}`]: {
            position: 'static !important' as any,
        },
        [`& .${classes["content"]}`]: {
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

/**
 * Represents a layout component for tabs.
 *
 * @template Data - The type of data to be used in the tabs.
 *
 * @param props - The props for the TabsLayout component.
 * @param props.children - The content of the TabsLayout component.
 * @param props.className - The CSS class name for the TabsLayout component.
 * @param props.style - The inline style for the TabsLayout component.
 * @param props.tabChange - The callback function for tab change event.
 * @param [props.tabVariant="fullWidth"] - The variant of the tabs (default: "fullWidth").
 * @param [props.tabLine=false] - Whether to show a line beneath the tabs (default: false).
 * @param [props.tabColor="primary"] - The color of the tabs (default: "primary").
 * @param [props.tabList=["Empty"]] - The list of tab labels (default: ["Empty"]).
 * @param [props.tabKeepFlow=false] - Whether to keep the flow of content when tabs are switched (default: false).
 * @param [props.tabBackground=false] - Whether to show a background color behind the content (default: false).
 * @param [props.tabIndex=0] - The default index of the active tab (default: 0).
 * @param props.columns - The number of columns for the Group container.
 * @param props.columnsOverride - The configuration object to override the number of columns for specific breakpoints.
 * @param props.isBaselineAlign - Whether to align the items based on the baseline.
 * @param props.sx - The custom CSS properties for the Group container.
 * @param props.phoneColumns - The number of columns for mobile devices.
 * @param props.tabletColumns - The number of columns for tablet devices.
 * @param props.desktopColumns - The number of columns for desktop devices.
 * @param [props.fieldRightMargin="0"] - The right margin for form fields (default: "0").
 * @param [props.fieldBottomMargin="0"] - The bottom margin for form fields (default: "0").
 *
 * @returns - The rendered TabsLayout component.
 */
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
    isBaselineAlign,
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
            isBaselineAlign={isBaselineAlign}
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

export default makeLayout(TabsLayout) as typeof TabsLayout;
