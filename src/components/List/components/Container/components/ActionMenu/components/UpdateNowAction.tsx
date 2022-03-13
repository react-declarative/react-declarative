import * as React from 'react';

import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import ListItemIcon from '@mui/material/ListItemIcon';

import Refresh from '@mui/icons-material/Refresh';

import useProps from "../../../../../hooks/useProps";

export const UpdateNowAction = () => {

    const { handleReload } = useProps();

    return (
        <MenuItem onClick={() => handleReload()}>
            <ListItemIcon>
                <Refresh />
            </ListItemIcon>
            <Typography variant="inherit">
                Refresh manually
            </Typography>
        </MenuItem>
    );

};

export default UpdateNowAction;
