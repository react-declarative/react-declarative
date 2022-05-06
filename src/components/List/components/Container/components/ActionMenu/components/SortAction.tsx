import * as React from 'react';

import { makeStyles } from '../../../../../../../styles';

import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import ListItemIcon from '@mui/material/ListItemIcon';

import Sort from '@mui/icons-material/Sort';

import useModalSort from '../../../../../hooks/useModalSort';

import classNames from '../../../../../../../utils/classNames';

interface ISortActionProps {
    enabled: boolean;
}

const useStyles = makeStyles({
    disabled: {
        opacity: 0.5,
    },
});

export const SortAction = ({
    enabled,
}: ISortActionProps) => {

    const classes = useStyles();

    const showModal = useModalSort();

    const handleClick = () => enabled && showModal();

    return (
        <MenuItem
            className={classNames({
                [classes.disabled]: !enabled,
            })}
            onClick={handleClick}
        >
            <ListItemIcon>
                <Sort />
            </ListItemIcon>
            <Typography variant="inherit">
                Change sort order
            </Typography>
        </MenuItem>
    );

};

export default SortAction;
