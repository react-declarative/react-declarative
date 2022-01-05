import * as React from 'react';

import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import ListItemIcon from '@mui/material/ListItemIcon';

import CheckBoxOn from '@mui/icons-material/CheckBox';
import CheckBoxOff from '@mui/icons-material/CheckBoxOutlineBlank';

import { useProps } from "../../../../PropProvider";

export const AutoReloadAction = () => {

    const { isMobile, handleSetMobile } = useProps();

    return (
        <MenuItem onClick={() => handleSetMobile(!isMobile)}>
            <ListItemIcon>
                {isMobile ? <CheckBoxOn /> : <CheckBoxOff />}
            </ListItemIcon>
            <Typography variant="inherit">
                Toggle Mobile
            </Typography>
        </MenuItem>
    );

};

export default AutoReloadAction;
