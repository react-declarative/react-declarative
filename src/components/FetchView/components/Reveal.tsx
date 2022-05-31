import * as React from 'react';

import { makeStyles } from '../../../styles';

import classNames from '../../../utils/classNames';

export interface IRevealProps extends React.HTMLProps<HTMLDivElement> {
    animation?: 'slideDown' | 'fadeIn' | 'scale' | 'none';
    appear?: boolean;
}

const useStyles = makeStyles({
    "@keyframes slideDown": {
        from: {
            opacity: 0,
            transform: "translateY(-10px)",
        },
        to: {
            opacity: 1,
            transform: "translateY(0)",
        },
    },
    "@keyframes fadeIn": {
        from: {
            opacity: 0,
        },
        to: {
            opacity: 1,
        },
    },
    "@keyframes scale": {
        from: {
            transform: "scale(0.4)",
        },
        to: {
            transform: "scale(1)",
        },
    },
    slideDown: {
        animation: "$slideDown 250ms ease-out",
    },
    fadeIn: {
        animation: "$fadeIn 250ms ease-out",
    },
    scale: {
        animation: "$scale 250ms ease-out",
    },
});

export const Reveal = ({
    children,
    className,
    animation = 'slideDown',
    appear = true,
    ...otherProps
}: IRevealProps) => {
    const classes = useStyles();

    const animationMap: Record<string, any> = {
        slideDown: classes.slideDown,
        fadeIn: classes.fadeIn,
        scale: classes.scale,
    };
    
    return (
        <div
            className={classNames(className, {
                [animationMap[animation]]: appear,
            })}
            {...otherProps}
        >
            {children}
        </div>
    );
}

export default Reveal;
