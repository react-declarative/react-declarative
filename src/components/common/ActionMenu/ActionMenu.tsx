import * as React from 'react';
import { useState } from 'react';

import { alpha } from '@mui/material';
import { makeStyles } from '../../../styles'; 

import classNames from '../../../utils/classNames';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import ListItemIcon from '@mui/material/ListItemIcon';

import MoreVertIcon from '@mui/icons-material/MoreVert';

import Fab from '@mui/material/Fab';

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