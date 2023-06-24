import React from 'react';

import { makeStyles } from '../../styles';

const useStyles = makeStyles()((theme) => ({
    adjust: {
        [theme.breakpoints.down('md')]: {
            padding: 25,
        },
    },
}));

export const ScrollAdjust = () => {
    const { classes } = useStyles();
    return <div className={classes.adjust} />
};

export default ScrollAdjust;
