import * as React from 'react';
import { useState, useRef, useLayoutEffect } from 'react';

import { makeStyles } from "../../styles";

import CircularProgress from '@mui/material/CircularProgress';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Box from '@mui/material/Box';

import useActualValue from '../../hooks/useActualValue';

import classNames from '../../utils/classNames';

const DEFAULT_THICKNESS = 3.6;
const DEFAULT_SIZE = 40;

/**
 * Props for the ActionIcon component.
 *
 * @typedef IActionIconProps
 * @property [onLoadStart] - A callback function triggered when the icon starts loading.
 * @property [onLoadEnd] - A callback function triggered when the icon finishes loading.
 * @property [onClick] - A callback function triggered when the icon is clicked.
 * @property [fallback] - A callback function triggered when an error occurs while loading the icon.
 * @property [throwError] - Indicates whether an error should be thrown if the icon fails to load.
 * @property [size] - The size of the icon.
 * @property [thickness] - The thickness of the icon.
 * @property [noProgress] - Indicates whether to hide the progress indicator during loading.
 */
interface IActionIconProps extends Omit<IconButtonProps, keyof {
    onClick: never;
    size: never;
}> {
    onLoadStart?: () => void;
    onLoadEnd?: (isOk: boolean) => void;
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => (void | Promise<void>);
    fallback?: (e: Error) => void;
    throwError?: boolean;
    size?: number;
    thickness?: number;
    noProgress?: boolean;
};

const useStyles = makeStyles()(() => ({
    root: {
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'stretch',
    },
    icon: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
    },
    spinner: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
    },
}));

/**
 * Represents an action icon component.
 * @typedef ActionIcon
 * @property className - The class name for the component.
 * @property style - The inline style for the component.
 * @property sx - The custom styling for the component using SX prop provided by Emotion.
 * @property noProgress - Determines if the progress spinner should be shown.
 * @property throwError - Determines if an error should be thrown in case of an exception.
 * @property disabled - Determines if the component is disabled.
 * @property onLoadStart - The callback function called when the action starts loading.
 * @property onLoadEnd - The callback function called when the action finishes loading.
 * @property onClick - The callback function called when the icon is clicked.
 * @property fallback - The fallback function called in case of an error and throwError is false.
 * @property children - The child components of the icon.
 * @property size - The size of the icon.
 * @property thickness - The thickness of the circular progress spinner.
 * @property otherProps - Other props to be passed to the IconButton component.
 */
export const ActionIcon = ({
    className,
    style,
    sx,
    noProgress = false,
    throwError = false,
    disabled = false,
    onLoadStart,
    onLoadEnd,
    onClick = () => { },
    fallback,
    children,
    size = DEFAULT_SIZE,
    thickness = DEFAULT_THICKNESS,
    ...otherProps
}: IActionIconProps) => {

    const { classes } = useStyles();

    const [loading, setLoading] = useState(0);

    const isMounted = useRef(true);

    useLayoutEffect(() => () => {
        isMounted.current = false;
    }, []);

    const loading$ = useActualValue(loading);

    /**
     * Handles click events on a button element.
     *
     * @param event - The click event object.
     * @returns - A Promise that resolves when the click event is handled.
     * @async
     */
    const handleClick = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const { current: loading } = loading$;
        if (loading) {
            return;
        }
        let isOk = true;
        try {
            onLoadStart && onLoadStart();
            isMounted.current && setLoading((loading) => loading + 1);
            await onClick(event);
        } catch (e: any) {
            isOk = false;
            if (!throwError) {
                fallback && fallback(e as Error);
            } else {
                throw e;
            }
        } finally {
            onLoadEnd && onLoadEnd(isOk);
            isMounted.current && setLoading((loading) => loading - 1);
        }
    };

    return (
        <Box
            className={classNames(className, classes.root)}
            style={style}
            sx={sx}
        >
            <Box
                sx={{
                    display: 'inline-flex',
                    alignItems: 'stretch',
                    justifyContent: 'stretch',
                    height: size,
                    width: size,
                }}
            >
                <IconButton
                    {...otherProps}
                    disabled={!!loading || disabled}
                    sx={{
                        position: 'relative',
                        height: size,
                        width: size,
                        flex: 1,
                    }}
                    onClick={handleClick}
                >
                    {(!!loading && !noProgress) && (
                        <div className={classes.spinner}>
                            <CircularProgress
                                size={size}
                                thickness={thickness}
                            />
                        </div>
                    )}
                    <Box className={classes.icon}>
                        {children}
                    </Box>
                </IconButton>
            </Box>
        </Box>
    );
};

export default ActionIcon;
