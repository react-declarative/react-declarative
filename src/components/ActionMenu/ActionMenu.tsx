import * as React from 'react';
import { useState } from 'react';

import { alpha } from '@mui/material';
import { makeStyles } from '../../styles';

import classNames from '../../utils/classNames';

import Async, { IAsyncProps } from '../Async';

import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import ListItemIcon from '@mui/material/ListItemIcon';
import CircularProgress from '@mui/material/CircularProgress';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import Fab from '@mui/material/Fab';

import IOption from '../../model/IOption';

export interface IActionMenuProps<T extends any = object> {
    options?: Partial<IOption>[];
    transparent?: boolean;
    disabled?: boolean;
    onAction?: (action: string) => void;
    onToggle?: (opened: boolean) => void;
    fallback?: (e: Error) => void;
    throwError?: boolean;
    className?: string;
    style?: React.CSSProperties;
    payload?: IAsyncProps<T>['payload'];
    onLoadStart?: IAsyncProps<T>['onLoadStart'];
    onLoadEnd?: IAsyncProps<T>['onLoadEnd'];
};

const useStyles = makeStyles((theme) => ({
    root: {
        zIndex: 'unset !important',
    },
    transparent: {
        boxShadow: 'none !important',
        background: 'transparent !important',
        color: `${alpha(theme.palette.getContrastText(theme.palette.background.default), 0.4)} !important`,
    },
    container: {
        position: 'relative',
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'stretch',
    },
    content: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'stretch',
    },
    loader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
}));

export const ActionMenu = <T extends any = object>({
    options = [],
    transparent = false,
    disabled = false,
    throwError = false,
    fallback,
    onToggle,
    onAction,
    payload,
    className,
    style,
    onLoadStart,
    onLoadEnd,
}: IActionMenuProps<T>) => {

    const [anchorEl, setAnchorEl] = useState(null);
    const [loading, setLoading] = useState(0);

    const classes = useStyles();

    const handleFocus = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        setAnchorEl(e.currentTarget);
        setLoading((loading) => loading + options.length);
        onToggle && onToggle(true);
    };

    const handleLoadEnd = (isOk: boolean) => {
        setLoading((loading) => loading - 1);
        onLoadEnd && onLoadEnd(isOk);
    };

    const handleClose = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        setAnchorEl(null);
        onToggle && onToggle(false);
    };

    const handleClick = (item: string) => (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        onAction && onAction(item);
        setAnchorEl(null);
        onToggle && onToggle(false);
    };

    return (
        <>
            <Fab
                className={classNames(className, classes.root, {
                    [classes.transparent]: transparent,
                })}
                disableFocusRipple={transparent}
                disableRipple={transparent}
                disabled={disabled}
                size="small"
                color="primary"
                aria-label="more"
                aria-haspopup="true"
                onClick={handleFocus}
                style={style}
            >
                <MoreVertIcon color="inherit" />
            </Fab>
            <Menu
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                anchorEl={anchorEl}
                open={!!anchorEl}
                onClose={handleClose}
            >
                <Box className={classes.container}>
                    {loading !== 0 && (
                        <Box className={classes.loader}>
                            <CircularProgress />
                        </Box>
                    )}
                    <Box
                        className={classes.content}
                        sx={{
                            visibility: loading !== 0 ? 'hidden' : 'visible',
                        }}
                    >
                        {options.map(({
                            label = 'unknown-label',
                            action = 'unknown-action',
                            icon: Icon,
                            isDisabled = () => false,
                            isVisible = () => true,
                        }, idx) => {
                            const Placeholder = () => (
                                <MenuItem
                                    sx={{
                                        visibility: 'hidden'
                                    }}
                                >
                                    {!!Icon && (
                                        <ListItemIcon>
                                            <Icon />
                                        </ListItemIcon>
                                    )}
                                    <Typography variant="inherit">
                                        {label}
                                    </Typography>
                                </MenuItem>
                            );
                            return (
                                <Async<T>
                                    Loader={Placeholder}
                                    throwError={throwError}
                                    fallback={fallback}
                                    key={idx}
                                    onLoadStart={onLoadStart}
                                    onLoadEnd={handleLoadEnd}
                                    payload={payload}
                                >
                                    {async () => {
                                        const disabled = await isDisabled();
                                        const visible = await isVisible();
                                        if (visible) {
                                            return (
                                                <MenuItem
                                                    disabled={disabled}
                                                    onClick={handleClick(action)}
                                                >
                                                    {!!Icon && (
                                                        <ListItemIcon>
                                                            <Icon />
                                                        </ListItemIcon>
                                                    )}
                                                    <Typography variant="inherit">
                                                        {label}
                                                    </Typography>
                                                </MenuItem>
                                            )
                                        } else {
                                            return null;
                                        }
                                    }}
                                </Async>
                            )
                        })}
                    </Box>
                </Box>
            </Menu>
        </>
    )
};

export default ActionMenu;