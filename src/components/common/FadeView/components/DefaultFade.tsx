import * as React from 'react';
import { useMemo } from 'react';

import { makeStyles } from '../../../../styles';

import { useTheme } from '@mui/material/styles';
import { alpha } from '@mui/material';

import classNames from '../../../../utils/classNames';

interface IDefaultFadeProps {
    className: string;
    visible: boolean;
    zIndex: number;
    position: 'bottom' | 'right';
    color?: string;
    none: boolean;
}

const useStyles = makeStyles((theme) => ({
    root: {
        pointerEvents: 'none',
        touchAction: 'none',
    },
    none: {
        display: "none",
    },
    visible: {
        animation: `$visible 500ms ${theme.transitions.easing.easeInOut}`,
        opacity: 1,
    },
    hidden: {
        animation: `$hidden 500ms ${theme.transitions.easing.easeInOut}`,
        opacity: 0,
    },
    "@keyframes visible": {
        "0%": {
            opacity: 0,
        },
        "100%": {
            opacity: 1,
        },
    },
    "@keyframes hidden": {
        "0%": {
            opacity: 1,
        },
        "100%": {
            opacity: 0,
        },
    },
}));

export const DefaultFade = ({
    className,
    visible,
    color,
    none,
    position,
    zIndex,
}: IDefaultFadeProps) => {
    const classes = useStyles();
    const theme = useTheme();

    const bg = useMemo(() => {
        const fadeColor = color || theme.palette.background.default;
        return {
            background: `linear-gradient(
                ${position === 'bottom' ? 'to bottom' : 'to right'},
                ${alpha(fadeColor, 0)},
                ${fadeColor}
            )`,
        };
    }, [theme, color])

    return (
        <div
            className={classNames(className, classes.root, {
                [classes.visible]: visible,
                [classes.hidden]: !visible,
                [classes.none]: none,
            })}
            style={{ 
                zIndex,
                ...bg
            }}
        />
    );
};

export default DefaultFade;
