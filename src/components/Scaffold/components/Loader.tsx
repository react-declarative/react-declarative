import * as React from 'react';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import { makeStyles } from '../../../styles';

/**
 * Returns the styles for a specific component.
 * @function
 * @name useStyles
 * @returns The styles object for the component.
 *
 * @param theme - The theme object provided by the Material-UIThemeProvider.
 * @param theme.palette.background.paper - The background color for the component.
 *
 */
const useStyles = makeStyles()((theme) => ({
    root: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        height: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        background: theme.palette.background.paper,
    }
}));

/**
 * Represents a loader component.
 *
 * @constructor
 * @returns The loader component.
 */
export const Loader = () => {
    const { classes } = useStyles();
    return (
        <Box className={classes.root}>
            <CircularProgress />
        </Box>
    );
};

export default Loader;
