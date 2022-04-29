import * as React from 'react';

import { makeStyles } from '../../../../../../../styles';

import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import ListItemIcon from '@mui/material/ListItemIcon';

import CheckBoxOn from '@mui/icons-material/CheckBox';
import CheckBoxOff from '@mui/icons-material/CheckBoxOutlineBlank';

import classNames from '../../../../../../../utils/classNames';

import useProps from "../../../../../hooks/useProps";

interface IAutoReloadActionProps {
    enabled: boolean;
}

const useStyles = makeStyles({
    disabled: {
        opacity: 0.5,
    },
});

export const AutoReloadAction = ({
    enabled,
}: IAutoReloadActionProps) => {

    const classes = useStyles();

    const { autoReload, handleAutoReload = () => null } = useProps();
    const handleClick = () => enabled && handleAutoReload(!autoReload);

    return (
        <MenuItem 
            className={classNames({
                [classes.disabled]: !enabled,
            })}
            onClick={handleClick}
        >
            <ListItemIcon>
                {autoReload ? <CheckBoxOn /> : <CheckBoxOff />}
            </ListItemIcon>
            <Typography variant="inherit">
                Toggle Autoreload
            </Typography>
        </MenuItem>
    );

};

export default AutoReloadAction;
