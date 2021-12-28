import * as React from 'react';
import { useState } from 'react';
import { makeStyles, alpha } from '@material-ui/core';

import classNames from '../../../utils/classNames';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import ListItemIcon from '@material-ui/core/ListItemIcon';

import MoreVertIcon from '@material-ui/icons/MoreVert';

import Fab from '@material-ui/core/Fab';

import IOption from '../../../model/IOption';

interface IActionMenuProps {
    options?: Partial<IOption>[];
    transparent?: boolean;
    disabled?: boolean;
    onAction?: (action: string) => void;
    onToggle?: (opened: boolean) => void;
};

const useStyles = makeStyles((theme) => ({
    transparent: {
        boxShadow: 'none !important',
        background: 'transparent !important',
        color: alpha(theme.palette.getContrastText(theme.palette.background.default), 0.4),
    },
}));

export const ActionMenu = ({
    options = [],
    transparent = false,
    disabled = false,
    onToggle = () => null,
    onAction,
}: IActionMenuProps) => {

    const [anchorEl, setAnchorEl] = useState(null);
    const classes = useStyles();
  
    const handleFocus = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        setAnchorEl(e.currentTarget);
        onToggle(true);
    };
  
    const handleClose = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        setAnchorEl(null);
        onToggle(false);
    };

    const handleClick = (item: string) => (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        onAction && onAction(item);
        setAnchorEl(null);
        onToggle(false);
    };

    return (
        <div>
            <Fab
                className={classNames({
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
            >
                <MoreVertIcon color="inherit" />
            </Fab>
            <Menu
                getContentAnchorEl={null}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                anchorEl={anchorEl}
                keepMounted
                open={!!anchorEl}
                onClose={handleClose}
            >
                {options.map(({label = 'unknown-label', action = 'unknown-action', icon: Icon}, idx) => (
                    <MenuItem key={idx} onClick={handleClick(action)}>
                        {!!Icon && (
                            <ListItemIcon>
                                <Icon />
                            </ListItemIcon>
                        )}
                        <Typography variant="inherit">
                            {label}
                        </Typography>
                    </MenuItem>
                ))}
            </Menu>
        </div>
    )
};

export default ActionMenu;