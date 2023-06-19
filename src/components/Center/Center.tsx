import * as React from 'react';

import { makeStyles } from '../../styles';

import Box, { BoxProps } from '@mui/material/Box';

import classNames from '../../utils/classNames';

interface ICenterProps extends BoxProps {
}

const useStyles = makeStyles()({
    root: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export const Center = ({
    className,
    ...otherProps
}: ICenterProps) => {
    const { classes } = useStyles();
    return (
        <Box
            className={classNames(className, classes.root)}
            {...otherProps}
        />
    );
}

export default Center;
