import React from 'react';

import { makeStyles } from '../../styles';

import classNames from '../../utils/classNames';

type Height = React.CSSProperties['height'];

let adjustForce = false;
let adjustHeight: Height = 25;

const useStyles = makeStyles()((theme) => ({
    adjust: {
        [theme.breakpoints.down('md')]: {
            padding: adjustHeight,
        },
    },
    adjustForce: {
        padding: adjustHeight,
    },
}));

export const ScrollAdjust = () => {
    const { classes } = useStyles();
    return (
        <div
            className={classNames({
                [classes.adjust]: !adjustForce,
                [classes.adjustForce]: adjustForce,
            })}
        />
    );
};

ScrollAdjust.setAdjustForce = (force: boolean) => {
    adjustForce = force
};

ScrollAdjust.setAdjustHeight = (height: Height) => {
    adjustHeight = height;
};

export default ScrollAdjust;
