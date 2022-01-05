import * as React from 'react';

import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import ListItemIcon from '@mui/material/ListItemIcon';

interface ICommonActionProps {
    icon?: React.ComponentType;
    onClick?: (e: any) => void;
    label: string;
};

export const CommonAction = ({
    icon: Icon,
    label,
    onClick,
}: ICommonActionProps) => {
    return (
        <MenuItem onClick={onClick}>
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
