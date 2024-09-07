import * as React from 'react';
import { forwardRef } from 'react';

import { makeStyles, keyframes } from '../../../styles';

import Box, { BoxProps } from '@mui/material/Box';

import classNames from '../../../utils/classNames';

/**
 * Interface for the props of the Reveal component.
 *
 * @interface IRevealProps
 * @extends BoxProps
 */
export interface IRevealProps extends BoxProps {
    animation?: 'slideDown' | 'fadeIn' | 'scale' | 'none';
    appear?: boolean;
}

const fadeInUpAnimation = keyframes({
    '0%': {
        opacity: '0',
        transform: 'translateY(-10px)',
    },
    '100%': {
        opacity: '1',
        transform: 'translateY(0)',
    }
});

const fadeInAnimation = keyframes({
    '0%': {
        opacity: '0',
    },
    '100%': {
        opacity: '1',
    }
});

const scaleUpAnimation = keyframes({
    '0%': {
        transform: 'scale(0.4)',
    },
    '100%': {
        transform: 'scale(1)',
    }
});

/**
 * The useStyles variable is assigned a function call to makeStyles().
 * makeStyles() is a styling function provided by a library like Material-UI, which returns a styles object.
 * The styles object contains CSS-in-JS style classes as key-value pairs.
 *
 */
const useStyles = makeStyles()({
    slideDown: {
        animation: `${fadeInUpAnimation} 250ms ease-out`
    },
    fadeIn: {
        animation: `${fadeInAnimation} 250ms ease-out`,
    },
    scale: {
        animation: `${scaleUpAnimation} 250ms ease-out`,
    },
});

/**
 * Reveal component.
 *
 * @param children - The content to reveal.
 * @param className - Custom CSS class name(s) to apply.
 * @param animation - The animation effect to apply when revealing the content. (default: 'slideDown')
 * @param appear - Flag indicating whether the content should appear on mount. (default: true)
 * @param otherProps - Additional props to be spread on the root element.
 *
 * @returns - The rendered component.
 */
const RevealInternal = ({
    children,
    className,
    animation = 'slideDown',
    appear = true,
    ...otherProps
}: IRevealProps, ref: React.Ref<HTMLDivElement>) => {
    const { classes } = useStyles();

    /**
     * Represents a map of animation effects.
     * @typedef AnimationMap
     * @property slideDown - The class name for the slide down animation effect.
     * @property fadeIn - The class name for the fade in animation effect.
     * @property scale - The class name for the scale animation effect.
     */
    const animationMap: Record<string, any> = {
        slideDown: classes.slideDown,
        fadeIn: classes.fadeIn,
        scale: classes.scale,
    };
    
    return (
        <Box
            ref={ref}
            className={classNames(className, {
                [animationMap[animation]]: appear,
            })}
            {...otherProps}
        >
            {children}
        </Box>
    );
}

export const Reveal = forwardRef(RevealInternal) as typeof RevealInternal;

export default Reveal;
