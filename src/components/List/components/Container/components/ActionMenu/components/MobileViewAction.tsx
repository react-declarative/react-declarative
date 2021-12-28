import * as React from 'react';

import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import ListItemIcon from '@material-ui/core/ListItemIcon';

import CheckBoxOn from '@material-ui/icons/CheckBox';
import CheckBoxOff from '@material-ui/icons/CheckBoxOutlineBlank';

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
