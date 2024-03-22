import * as React from 'react';

import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import classNames from '../../../../../../utils/classNames';

import { makeStyles } from '../../../../../../styles';
import { alpha } from '@mui/material';

interface IModalLoaderProps {
    open: boolean;
}

const useStyles = makeStyles()({
    root: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        height: '100%',
        width: '100%',
        background: alpha('#000', 0.2),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999,
    },
    hidden: {
        display: 'none !important',
    },
});

/**
 * Renders a modal loader component.
 *
 * @param props - The props for the ModalLoader component.
 * @param props.open - Indicates whether the modal loader is open.
 * @returns The rendered ModalLoader component.
 */
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
