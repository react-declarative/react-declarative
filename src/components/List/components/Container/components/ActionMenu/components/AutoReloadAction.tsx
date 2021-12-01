import * as React from 'react';

import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import ListItemIcon from '@material-ui/core/ListItemIcon';

import CheckBoxOn from '@material-ui/icons/CheckBox';
import CheckBoxOff from '@material-ui/icons/CheckBoxOutlineBlank';

import { useProps } from "../../../../PropProvider";

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
