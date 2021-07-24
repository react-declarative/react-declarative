import * as React from 'react';
import { useState } from 'react';

import { useProps } from "../../../PropProvider";

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import ListItemIcon from '@material-ui/core/ListItemIcon';

import MoreVertIcon from '@material-ui/icons/MoreVert';

import Fab from '@material-ui/core/Fab';

import IOption from '../../../../../../model/IOption';

interface IActionMenuProps {
    options?: Partial<IOption>[];
}

export const ActionMenu = ({
    options = [],
}: IActionMenuProps) => {

    const listProps = useProps();

    const [anchorEl, setAnchorEl] = useState(null);
  
    const handleFocus = (event: any) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };

    const {
        onAction,
    } = listProps;

    const handleClick = (item: string) => (e: any) => {
        e.stopPropagation();
        onAction && onAction(item);
        handleClose();
    };

    return (
        <div>
            <Fab
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
}

export default ActionMenu;