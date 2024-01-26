import * as React from 'react';

import { makeStyles } from '../../../styles';

import MenuItem from '@mui/material/MenuItem';

import ISearchItemProps from '../model/ISearchItemProps';

const useStyles = makeStyles()({
    item: {
        whiteSpace: "break-spaces",
    },
});

export const SearchItem = ({
    value,
    label,
}: ISearchItemProps) => {
    const { classes } = useStyles();
    return (
        <MenuItem
            className={classes.item}
            key={value}
            value={value}
        >
            {label}
        </MenuItem>
    );
};

export default SearchItem;