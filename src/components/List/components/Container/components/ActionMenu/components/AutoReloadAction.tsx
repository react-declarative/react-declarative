import * as React from 'react';

import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import ListItemIcon from '@mui/material/ListItemIcon';

import CheckBoxOn from '@mui/icons-material/CheckBox';
import CheckBoxOff from '@mui/icons-material/CheckBoxOutlineBlank';

import useProps from "../../../../../hooks/useProps";

export const AutoReloadAction = () => {

    const { autoReload, handleAutoReload } = useProps();

    return (
        <MenuItem onClick={() => handleAutoReload(!autoReload)}>
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
