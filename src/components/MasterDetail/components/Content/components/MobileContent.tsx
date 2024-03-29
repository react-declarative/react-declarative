import * as React from 'react';
import { useMemo } from 'react';

import { makeStyles } from '../../../../../styles';
import { alpha } from '@mui/material';

import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import classNames from '../../../../../utils/classNames';

import IContentProps from '../IContentProps';

import { MASTER_DETAIL_HEADER } from '../../../config';

const TAB_HEIGHT = 48;

const useStyles = makeStyles()((theme) => ({
    root: {
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'stretch',
        flexDirection: 'column',
    },
    header: {
        background: theme.palette.mode === 'light'
            ? alpha('#000', 0.05)
            : theme.palette.background.paper,
    },
    content: {
        position: 'relative',
        flex: 1,
        overflowY: 'auto',
        padding: theme.spacing(1),
    },
    tabsRoot: {
        marginLeft: '0 !important',
        minHeight: TAB_HEIGHT,
        height: TAB_HEIGHT
    },
    tabRoot: {
        minHeight: TAB_HEIGHT,
        height: TAB_HEIGHT
    },
}));

/**
 * Represents a mobile content component.
 *
 * @param items - The array of items for the tabs.
 * @param children - The children nodes to be rendered inside the content box.
 * @param onChange - The callback function to be called when the active tab is changed.
 * @returns The rendered mobile content component.
 */
export const MobileContent = ({
    items,
    children,
    onChange,
}: IContentProps) => {
    const { classes } = useStyles();

    const activeItem = useMemo(() => items.find(({ active }) => active), [items]);

    return (
        <Box className={classes.root}>
            <Tabs
                className={classNames(classes.header, MASTER_DETAIL_HEADER)}
                variant='scrollable'
                indicatorColor='primary'
                value={activeItem?.id}
                classes={{
                    root: classes.tabsRoot,
                }}
                onChange={(_, value) => onChange(value)}
            >
                {items
                    .filter(({ visible }) => visible)
                    .map(({
                        id,
                        label,
                        disabled,
                        icon: Icon,
                    }, idx) => (
                        <Tab
                            key={`${id}-${idx}`}
                            label={label}
                            value={id}
                            disabled={disabled}
                            icon={Icon && <Icon />}
                            iconPosition='start'
                            classes={{
                                root: classes.tabRoot
                            }}
                        />
                    ))
                }
            </Tabs>
            <Box className={classes.content}>
                {children}
            </Box>
        </Box>
    );
};

export default MobileContent;
