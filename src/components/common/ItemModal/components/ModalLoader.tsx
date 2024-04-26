import * as React from 'react';

import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import { makeStyles } from '../../../../styles';

import classNames from '../../../../utils/classNames';

interface IModalLoaderProps {
    open: boolean;
}

const useStyles = makeStyles()((theme) => ({
    root: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        height: '100%',
        width: '100%',
        background: theme.palette.background.paper,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999,
    },
    hidden: {
        display: 'none !important',
    },
}));

export const ModalLoader = ({
    open,
}: IModalLoaderProps) => {
    const { classes } = useStyles();
    return (
        <Box className={classNames(classes.root, {
            [classes.hidden]: !open,
        })}>
            <CircularProgress />
        </Box>
    );
};

export default ModalLoader;
