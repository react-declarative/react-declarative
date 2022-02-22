import * as React from 'react';

import { makeStyles } from '../../../styles';
import { alpha } from '@mui/material';

import classNames from '../../../utils/classNames';

interface IDefaultFadeProps {
    className: string;
    visible: boolean;
    zIndex: number;
    none: boolean;
}

const useStyles = makeStyles((theme) => ({
    root: {
        background: `linear-gradient(
            to bottom,
            ${alpha(theme.palette.background.default, 0)},
            ${theme.palette.background.default}
        )`,
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
    none,
    zIndex,
}: IDefaultFadeProps) => {
    const classes = useStyles();
    return (
        <div
            className={classNames(className, classes.root, {
                [classes.visible]: visible,
                [classes.hidden]: !visible,
                [classes.none]: none,
            })}
            style={{ 
                zIndex,
            }}
        />
    );
};

export default DefaultFade;
