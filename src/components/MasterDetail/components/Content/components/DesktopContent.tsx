import * as React from 'react';

import { makeStyles } from '../../../../../styles';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import classNames from '../../../../../utils/classNames';

import IContentProps from '../IContentProps';

import { MASTER_DETAIL_HEADER } from '../../../config';

const useStyles = makeStyles()((theme) => ({
    root: {
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'stretch',
    },
    sideMenu: {
        flex: 1,
        maxWidth: 256,
        overflowY: 'auto',
        borderRight: `1px solid ${theme.palette.divider}`,
    },
    listItem: {
        '&:not(:last-of-type)': {
            borderBottom: `1px solid ${theme.palette.divider}`,
        },
    },
    content: {
        position: 'relative',
        flex: 1,
        overflowY: 'auto',
        padding: theme.spacing(1),
    },
}));

export const DesktopContent = ({
    children,
    items,
    onChange,
}: IContentProps) => {
    const { classes } = useStyles();
    return (
        <Box className={classes.root}>
            <List disablePadding dense className={classNames(classes.sideMenu, MASTER_DETAIL_HEADER)}>
                {items
                    .filter(({ visible }) => !!visible)
                    .map(({
                        id,
                        active,
                        disabled,
                        icon: Icon,
                        label,
                    }, idx) => (
                        <ListItem disableGutters disablePadding dense key={`${id}-${idx}`} className={classes.listItem}>
                            <ListItemButton
                                disabled={disabled}
                                selected={active}
                                onClick={() => onChange(id)}
                            >
                                {!!Icon && (
                                    <ListItemIcon>
                                        <Icon />
                                    </ListItemIcon>
                                )}
                                <ListItemText>{label}</ListItemText>
                            </ListItemButton>
                        </ListItem>
                    ))}
            </List>
            <Box className={classes.content}>
                {children}
            </Box>
        </Box>
    );
};

export default DesktopContent;
