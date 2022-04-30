import * as React from 'react';
import { useState, useMemo } from 'react';

import { makeStyles } from '../../../../../../styles';

import useProps from "../../../../hooks/useProps";

import Menu from '@mui/material/Menu';

import MoreVertIcon from '@mui/icons-material/MoreVert';

import Fab from '@mui/material/Fab';

import IListOption from '../../../../../../model/IListOption';

import CommonAction from './components/CommonAction';
import UpdateNowAction from './components/UpdateNowAction';
import AutoReloadAction from './components/AutoReloadAction';
import MobileViewAction from './components/MobileViewAction';

interface IActionMenuProps {
    options?: Partial<IListOption>[];
}

const useStyles = makeStyles({
    root: {
        zIndex: 'unset !important',
    },
});

export const ActionMenu = ({
    options = [],
}: IActionMenuProps) => {

    const classes = useStyles();

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
        actionAvalibility: avalibility,
    } = listProps;

    const actionAvalibility = useMemo(() => {
        const actionAvalibility = options.reduce((acm, {
            action = 'unknown-action',
            enabled = true,
        }) => ({
            [action]: enabled,
            ...acm,
        }), {
            ['unknown-action']: true,
        });
        return {
            ...actionAvalibility,
            ...avalibility,
        };
    }, [options, avalibility]);

    const handleClick = (item: string) => (e: any) => {
        e.stopPropagation();
        if (actionAvalibility[item]) {
            onAction && onAction(item);
            handleClose();
        }
    };

    return (
        <div>
            <Fab
                className={classes.root}
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
                            <UpdateNowAction enabled={actionAvalibility[action]} key={idx} />
                        );
                    } else if (action === 'auto-reload') {
                        return (
                            <AutoReloadAction enabled={actionAvalibility[action]} key={idx} />
                        );
                    } else if (action === 'mobile-view') {
                        return (
                            <MobileViewAction enabled={actionAvalibility[action]} key={idx} />
                        );
                    } else {
                        return (
                            <CommonAction
                                key={idx}
                                icon={icon}
                                label={label}
                                enabled={actionAvalibility[action]}
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