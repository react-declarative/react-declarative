import * as React from 'react';

import { makeStyles } from '../../../../../../../styles';

import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import ListItemIcon from '@mui/material/ListItemIcon';

import Refresh from '@mui/icons-material/Refresh';

import useProps from "../../../../../hooks/useProps";

import classNames from '../../../../../../../utils/classNames';

interface IUpdateNowActionProps {
    enabled: boolean;
}

const useStyles = makeStyles({
    disabled: {
        opacity: 0.5,
    },
});

export const UpdateNowAction = ({
    enabled,
}: IUpdateNowActionProps) => {

    const classes = useStyles();

    const { handleReload = () => null } = useProps();
    const handleClick = () => enabled && handleReload();

    return (
        <MenuItem
            className={classNames({
                [classes.disabled]: !enabled,
            })}
            onClick={handleClick}
        >
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
