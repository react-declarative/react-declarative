import * as React from 'react';
import { useState, useRef, useLayoutEffect } from 'react';

import { SxProps } from '@mui/material';

import { makeStyles } from "../../styles";

import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import CloseIcon from '@mui/icons-material/Close';

import useActualValue from '../../hooks/useActualValue';

import classNames from '../../utils/classNames';

const DEFAULT_THICKNESS = 3.6;
const DEFAULT_SIZE = 40;

interface IActionStopIconProps extends Omit<IconButtonProps, keyof {
    className: never;
    style: never;
    sx: never;
    size: never;
    thickness: never;
    onClick: never;
}> {
    children?: React.ReactNode;
    sx?: SxProps<any>;
    className?: string;
    style?: React.CSSProperties;
    noProgress?: boolean;
    disabled?: boolean;
    size?: number;
    thickness?: number;
    onLoadStart?: () => void;
    onLoadEnd?: (isOk: boolean) => void;
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => (void | Promise<void>);
    fallback?: (e: Error) => void;
    throwError?: boolean;
};

const useStyles = makeStyles<{
    size: number;
    thickness: number;
}>()((_, {
    size,
    // thickness,
}) => ({
    root: {
        display: 'inline-flex',
        alignItems: 'stretch',
        justifyContent: 'stretch',
        height: size,
        width: size,
    },
    container: {
        position: 'relative',
        height: size,
        width: size,
        flex: 1,
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
 * Represents an ActionStopIcon component.
 *
 * @typedef {Object} IActionStopIconProps
 * @property {string} className - The CSS class name for the component.
 * @property {Object} style - The inline CSS styles for the component.
 * @property {Object} sx - The system styles for the component.
 * @property {number} size - The size of the icon. Default is DEFAULT_SIZE.
 * @property {number} thickness - The thickness of the CircularProgress spinner. Default is DEFAULT_THICKNESS.
 * @property {boolean} noProgress - Flag indicating whether to show the CircularProgress spinner. Default is false.
 * @property {boolean} throwError - Flag indicating whether to throw an error or trigger the fallback function upon an error. Default is false.
 * @property {boolean} disabled - Flag indicating whether the component is disabled. Default is false.
 * @property {Function} onLoadStart - Callback function triggered when the component starts loading.
 * @property {Function} onLoadEnd - Callback function triggered when the component finishes loading.
 * @property {Function} fallback - The fallback function to be called when an error occurs and 'throwError' is set to false.
 * @property {Function} onClick - The click event handler for the component. Default is an empty function.
 * @property {ReactNode} children - The child element to be rendered inside the component. Default is a CloseIcon.
 * @property {Object} otherProps - Any additional props for the component.
 */
export const ActionStopIcon = ({
    className,
    style,
    sx,
    size = DEFAULT_SIZE,
    thickness = DEFAULT_THICKNESS,
    noProgress = false,
    throwError = false,
    disabled = false,
    onLoadStart,
    onLoadEnd,
    fallback,
    onClick = () => { },
    children = <CloseIcon />,
    ...otherProps
}: IActionStopIconProps) => {

    const { classes } = useStyles({
        size,
        thickness,
    });
    const [loading, setLoading] = useState(0);

    const isMounted = useRef(true);

    useLayoutEffect(() => () => {
      isMounted.current = false;
    }, []);

    const loading$ = useActualValue(loading);

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
            <IconButton
                {...otherProps}
                className={classes.container}
                disabled={!!loading || disabled}
                onClick={handleClick}
            >
                {!noProgress && (
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
    );
};

export default ActionStopIcon;
