import * as React from 'react';

import { makeStyles } from '../../../../../../../styles';

import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import ListItemIcon from '@mui/material/ListItemIcon';

import CheckBoxOn from '@mui/icons-material/CheckBox';
import CheckBoxOff from '@mui/icons-material/CheckBoxOutlineBlank';

import useProps from "../../../../../hooks/useProps";

import classNames from '../../../../../../../utils/classNames';

interface IMobileViewActionProps {
    enabled: boolean;
}

const useStyles = makeStyles({
    disabled: {
        opacity: 0.5,
    },
});

export const MobileViewAction = ({
    enabled,
}: IMobileViewActionProps) => {

    const classes = useStyles();

    const { isMobile, handleSetMobile = () => null } = useProps();
    const handleClick = () => enabled && handleSetMobile(!isMobile);

    return (
        <MenuItem
            className={classNames({
                [classes.disabled]: !enabled,
            })}
            onClick={handleClick}
        >
            <ListItemIcon>
                {isMobile ? <CheckBoxOn /> : <CheckBoxOff />}
            </ListItemIcon>
            <Typography variant="inherit">
                Toggle Mobile
            </Typography>
        </MenuItem>
    );

};

export default MobileViewAction;
