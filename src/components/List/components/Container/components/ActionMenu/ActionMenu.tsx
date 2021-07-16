import * as React from 'react';
import { useState } from 'react';

import { useProps } from "../../../PropProvider";

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import MoreVertIcon from '@material-ui/icons/MoreVert';

import Fab from '@material-ui/core/Fab';

interface IActionMenuProps {
    options?: {
        label: string;
        action: string;
    }[];
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
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={handleFocus}
            >
                <MoreVertIcon />
            </Fab>
            <Menu
                id="long-menu"
                anchorEl={anchorEl}
                keepMounted
                open={!!anchorEl}
                onClose={handleClose}
            >
                {options.map(({label, action}, idx) => (
                    <MenuItem key={idx} onClick={handleClick(action)}>
                        {label}
                    </MenuItem>
                ))}
            </Menu>
        </div>
    )
}

export default ActionMenu;