import * as React from 'react';

import { makeStyles, keyframes } from '../../../styles';

import Box, { BoxProps } from '@mui/material/Box';

import classNames from '../../../utils/classNames';

export interface IRevealProps extends BoxProps {
    animation?: 'slideDown' | 'fadeIn' | 'scale' | 'none';
    appear?: boolean;
}

const useStyles = makeStyles()({
    slideDown: {
        animation: `${keyframes`
            0% {
                opacity: 0;
                transform: translateY(-10px);
            }
            100% {
                opacity: 1;
                transform: translateY(0);
            }
        `} 250ms ease-out`
    },
    fadeIn: {
        animation: `${keyframes`
            0% {
                opacity: 0;
            }
            100% {
                opacity: 1;
            }
        `} 250ms ease-out`,
    },
    scale: {
        animation: `${keyframes`
            0% {
                transform: scale(0.4);
            }
            100% {
                transform: scale(1);
            }
        `} 250ms ease-out`,
    },
});

export const Reveal = ({
    children,
    className,
    animation = 'slideDown',
    appear = true,
    ...otherProps
}: IRevealProps) => {
    const { classes } = useStyles();

    const animationMap: Record<string, any> = {
        slideDown: classes.slideDown,
        fadeIn: classes.fadeIn,
        scale: classes.scale,
    };
    
    return (
        <Box
            className={classNames(className, {
                [animationMap[animation]]: appear,
            })}
            {...otherProps}
        >
            {children}
        </Box>
    );
}

export default Reveal;
