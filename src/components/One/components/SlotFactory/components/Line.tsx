import * as React from 'react';

import { makeStyles } from '../../../../../styles';
import { alpha } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { ILineSlot } from '../../../slots/LineSlot';

/**
 * The useStyles variable is used to define and retrieve custom styles
 * for a component using the makeStyles function provided by the Material-UI library.
 *
 * @param {Object} theme - The theme object provided by the Material-UI library.
 * @returns {Object} - An object containing the custom styles for the component.
 */
const useStyles = makeStyles()((theme) => ({
    root: {
        height: 72,
        display: 'flex',
        flexWrap: 'nowrap',
        whiteSpace: 'nowrap',
        alignItems: 'center',
        justifyContent: 'stretch',
    },
    line: {
        background: alpha(theme.palette.getContrastText(theme.palette.background.default), 0.23),
        flexGrow: 1,
        margin: 15,
        height: 1,
    }
}));

/**
 * Represents a line component with optional title and transparency options.
 * @typedef  ILineSlot
 * @property title - The title of the line component.
 * @property lineTransparent - Specifies whether the line component should be transparent or not.
 *
 * @param Line - The configuration object for the line component.
 * @returns - The rendered line component.
 */
export const Line = ({
    title = "",
    lineTransparent = false,
}: ILineSlot) => {
    const { classes } = useStyles();
    return (
        <Box className={classes.root}>
            <Typography variant="h5">{title}</Typography>
            {!lineTransparent && (
                <Box className={classes.line} />
            )}
        </Box>
    );
};

export default Line;
