import * as React from 'react';

import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import ListItemIcon from '@material-ui/core/ListItemIcon';

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
