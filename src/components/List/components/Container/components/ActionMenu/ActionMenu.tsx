import * as React from 'react';
import { useState } from 'react';

import useProps from "../../../../hooks/useProps";

import Menu from '@mui/material/Menu';

import MoreVertIcon from '@mui/icons-material/MoreVert';

import Fab from '@mui/material/Fab';

import IOption from '../../../../../../model/IOption';

import CommonAction from './components/CommonAction';
import UpdateNowAction from './components/UpdateNowAction';
import AutoReloadAction from './components/AutoReloadAction';
import MobileViewAction from './components/MobileViewAction';

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
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                anchorEl={anchorEl}
                keepMounted
                open={!!anchorEl}
                onClose={handleClose}
            >
                {options.map(({label = 'unknown-label', action = 'unknown-action', icon}, idx) => {
                    if (action === 'update-now') {
                        return (
                            <UpdateNowAction key={idx} />
                        );
                    } else if (action === 'auto-reload') {
                        return (
                            <AutoReloadAction key={idx} />
                        );
                    } else if (action === 'mobile-view') {
                        return (
                            <MobileViewAction key={idx} />
                        );
                    } else {
                        return (
                            <CommonAction
                                key={idx}
                                icon={icon}
                                label={label}
                                onClick={handleClick(action)}
                            />
                        );
                    }
                })}
            </Menu>
        </div>
    )
}

export default ActionMenu;