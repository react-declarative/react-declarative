import React from 'react';
import { createElement } from 'react';

import { makeStyles } from '../../styles';

import classNames from '../../utils/classNames';

type Height = Exclude<React.CSSProperties['height'], undefined>;

let adjustForce = false;
let adjustHeight: Height = 25;
let adjustFiller: React.ComponentType<any> | null = null;

const useStyles = makeStyles()((theme) => ({
    adjust: {
        [theme.breakpoints.down('md')]: {
            paddingBottom: adjustHeight,
        },
    },
    adjustForce: {
        paddingBottom: adjustHeight,
    },
}));

/**
 * Represents a component that adjusts the scroll behavior based on certain conditions.
 *
 * @returns - The adjusted scroll component.
 */
export const ScrollAdjust = () => {
    const { classes } = useStyles();
    return (
        <div
            className={classNames({
                [classes.adjust]: !adjustForce,
                [classes.adjustForce]: adjustForce,
            })}
        >
            {adjustFiller && createElement(adjustFiller)}
        </div>
    );
};

/**
 * Sets the value to adjust the scroll force.
 *
 * @param force - The force to adjust the scroll.
 */
ScrollAdjust.setAdjustForce = (force: boolean) => {
    adjustForce = force
};

/**
 * Sets the adjustment height for scrollbars.
 *
 * @param adjustHeight - The height to adjust the scrollbars.
 * @returns
 */
ScrollAdjust.setAdjustHeight = (height: Height) => {
    adjustHeight = height;
};

/**
 * Sets the adjustment filler for ScrollAdjust component.
 *
 * @param filler - The HTML element to be used as adjustment filler.
 */
ScrollAdjust.setAdjustFiller = (element: React.ComponentType<any>) => {
    adjustFiller = element;
};

export default ScrollAdjust;
