import * as React from 'react';

import { makeStyles } from '../../../../../../../styles';

import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import ListItemIcon from '@mui/material/ListItemIcon';

import classNames from '../../../../../../../utils/classNames';

interface ICommonActionProps {
    icon?: React.ComponentType;
    onClick?: (e: any) => void;
    enabled: boolean;
    label: string;
};

const useStyles = makeStyles({
    disabled: {
        opacity: 0.5,
    },
});

export const CommonAction = ({
    icon: Icon,
    label,
    enabled,
    onClick,
}: ICommonActionProps) => {
    const classes = useStyles();
    return (
        <MenuItem
            className={classNames({
                [classes.disabled]: !enabled,
            })}
            onClick={onClick}
        >
            {!!Icon && (
                <ListItemIcon>
                    <Icon />
                </ListItemIcon>
            )}
            <Typography variant="inherit">
                {label}
            </Typography>
        </MenuItem>
    );
};

export default CommonAction;
