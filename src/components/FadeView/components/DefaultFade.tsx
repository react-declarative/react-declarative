import * as React from 'react';
import { useMemo } from 'react';

import { makeStyles, keyframes } from '../../../styles';

import { useTheme } from '@mui/material/styles';
import { alpha } from '@mui/material';

import classNames from '../../../utils/classNames';

/**
 * Interface representing the props for the DefaultFade component.
 */
interface IDefaultFadeProps {
    className: string;
    visible: boolean;
    zIndex: number;
    position: 'bottom' | 'right';
    color?: string;
    none: boolean;
}

/**
 * Creates a useStyles object that can be used to access CSS styles.
 *
 * @returns {Object} The useStyles object.
 */
const useStyles = makeStyles()(() => ({
    root: {
        pointerEvents: 'none',
        touchAction: 'none',
    },
    none: {
        display: "none",
    },
    visible: {
        animation: `${keyframes`
            0% {
                opacity: 0;
            }
            100% {
                opacity: 1;
            }
        `} 500ms ease-in-out`,
        opacity: 1,
    },
    hidden: {
        animation: `${keyframes`
            0% {
                opacity: 1;
            }
            100% {
                opacity: 0;
            }
        `} 500ms ease-in-out`,
        opacity: 0,
    },
}));

/**
 * Represents a component that applies a fade effect to its background.
 * @typedef {Object} IDefaultFadeProps
 * @property {string} className - The additional CSS class to be applied to the root element.
 * @property {boolean} visible - Determines if the component is visible.
 * @property {string} color - The color of the fade effect. If not provided, the default background color of the theme will be used.
 * @property {boolean} none - Determines if the fade effect should not be applied.
 * @property {string} position - The position of the fade effect. Can be either 'bottom' or 'right'.
 * @property {number} zIndex - The z-index of the root element.
 */
export const DefaultFade = ({
    className,
    visible,
    color,
    none,
    position,
    zIndex,
}: IDefaultFadeProps) => {
    const { classes } = useStyles();
    const theme = useTheme();

    /**
     * Returns a memoized object with background CSS property.
     *
     * @param {object} theme - The theme object.
     * @param {?string} color - The color value.
     *
     * @returns {object} - The memoized background object.
     */
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
