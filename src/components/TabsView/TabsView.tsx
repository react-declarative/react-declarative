import * as React from 'react';
import { useState, useEffect } from 'react';

import { makeStyles } from '../../styles';

import Tabs, { TabsProps } from '@mui/material/Tabs';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';

import Async, { IAsyncProps } from '../Async';

import useActualCallback from '../../hooks/useActualCallback';
import useActualState from '../../hooks/useActualState';

import classNames from '../../utils/classNames';

import ITab from '../../model/ITab';

const TAB_PLACEHOLDER_VALUE = 'placeholder';

export interface ITabsViewProps<T extends any = string> extends Omit<IAsyncProps<T>, keyof {
    children: never;
    Error: never;
}> {
    className?: string;
    style?: React.CSSProperties;
    items: ITab<T>[];
    value?: string;
    children: (value: string) => React.ComponentType<any>;
    onChange?: (value: string) => void;
    centered?: TabsProps['centered'];
    variant?: TabsProps['variant'];
    noUnderline?: boolean;
}

interface ITabItem extends Omit<ITab, keyof {
    isVisible: never;
    isDisabled: never;
}> {
    visible: boolean;
    disabled: boolean;
}

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    container: {
        width: '100%',
    },
    content: {
        width: '100%',
    },
    none: {
        display: 'none',
    },
    underline: {
        borderBottom: `1px solid ${theme.palette.divider}`,
        '& > .MuiTabs-root': {
            marginBottom: '-1px',
        },
    },
}));

const Fragment = () => <></>;

export const TabsView = <T extends any = string>({
    className,
    style,
    centered,
    variant,
    items = [],
    value: defaultValue,
    noUnderline = false,
    children,
    onChange,
    onLoadStart,
    onLoadEnd,
    Loader = Fragment,
    ...otherProps
}: ITabsViewProps<T>) => {

    const classes = useStyles();

    const [tabs, setTabs] = useActualState<ITabItem[]>([]);

    const [child, setChild] = useState<React.ReactElement | null>(null);
    const [value, setValue] = useState(defaultValue);
    const [loader, setLoader] = useState(0);

    const handleChange = (value: string) => {
        setValue(value);
        onChange && onChange(value);
    };

    useEffect(() => {
        if (value && tabs.current.some((tab) => tab.value === value && tab.visible && !tab.disabled)) {
            const Element = children(value);
            setChild(<Element />);
        }
    }, [value, tabs.current]);

    const handleLoadStart = useActualCallback(() => {
        setLoader((loader) => loader + 1);
        setTabs([]);
        onLoadStart && onLoadStart();
    });

    const handleLoadEnd = useActualCallback((isOk: boolean) => {
        if (!value) {
            const tab = tabs.current.find(({ visible, disabled }) => visible && !disabled);
            handleChange(tab?.value || TAB_PLACEHOLDER_VALUE);
        }
        setLoader((loader) => loader - 1);
        onLoadEnd && onLoadEnd(isOk);
    });

    return (
        <Box
            className={classNames(classes.root, className)}
            style={style}
        >
            {!!loader && <Loader />}
            <Box className={classNames(classes.container, {
                [classes.underline]: !noUnderline,
                [classes.none]: !!loader,
            })}>
                {!!value && !!tabs.current.length && (
                    <Tabs
                        variant={variant}
                        centered={centered}
                        value={value}
                        key={tabs.current.length}
                        onChange={(_, value) => handleChange(value)}
                    >
                        {tabs.current.map(({
                            visible,
                            label,
                            disabled,
                            icon: Icon,
                            value,
                        }, idx) => visible ? (
                                <Tab
                                    key={idx}
                                    label={label}
                                    value={value}
                                    disabled={disabled}
                                    icon={Icon && <Icon />}
                                />
                            ) : null
                        )}
                    </Tabs>
                )}
            </Box>
            <Box className={classNames(classes.content, {
                [classes.none]: !!loader,
            })} p={3}>
                {child}
            </Box>
            <Async<T>
                {...otherProps}
                onLoadStart={handleLoadStart}
                onLoadEnd={handleLoadEnd}
            >
                {async (payload) => {

                    const tabs = await Promise.all(items.map(async ({
                        isVisible = () => true,
                        isDisabled = () => false,
                        ...other
                    }) => ({
                        visible: await isVisible(payload),
                        disabled: await isDisabled(payload),
                        ...other,
                    })));

                    setTabs(tabs);
                }}
            </Async>
        </Box>
    );

};

export default TabsView;
