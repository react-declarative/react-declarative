import * as React from 'react';

import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import ListItemIcon from '@material-ui/core/ListItemIcon';

import Refresh from '@material-ui/icons/Refresh';

import { useProps } from "../../../../PropProvider";

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
