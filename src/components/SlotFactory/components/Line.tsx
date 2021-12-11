import * as React from 'react';

import { makeStyles } from '@material-ui/core';
import { alpha } from '@material-ui/core/styles';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import { ILineSlot } from '../../../slots/LineSlot';

const useStyles = makeStyles((theme) => ({
    root: {
        height: 72,
        display: 'flex',
        flexWrap: 'nowrap',
        whiteSpace: 'nowrap',
        alignItems: 'center',
        justifyContent: 'stretch',
    },
    line: {
        border: `1px solid ${alpha(theme.palette.getContrastText(theme.palette.background.default), 0.23)}`,
        flexGrow: 1,
        margin: 15,
        height: 1,
    }
}));

export const Line = ({
    title = "",
}: ILineSlot) => {
    const classes = useStyles();
    return (
        <Box className={classes.root}>
            <Typography variant="h5">{title}</Typography>
            <Box className={classes.line}></Box>
        </Box>
    );
};

export default Line;
