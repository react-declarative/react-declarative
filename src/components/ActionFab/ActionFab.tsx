import * as React from 'react';
import { useState, useRef, useLayoutEffect } from 'react';

import { makeStyles } from "../../styles";

import CircularProgress from '@mui/material/CircularProgress';
import Fab, { FabProps } from '@mui/material/Fab';
import Box from '@mui/material/Box';

import useActualValue from '../../hooks/useActualValue';

import classNames from '../../utils/classNames';

const DEFAULT_THICKNESS = 3.6;
const DEFAULT_SIZE = 40;

/**
 * Represents the props for the ActionFab component.
 * @interface
 * @extends FabProps
 */
interface IActionFabProps extends Omit<FabProps, keyof {
    onClick: never;
    size?: never;
}> {
    onLoadStart?: () => void;
    onLoadEnd?: (isOk: boolean) => void;
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => (void | Promise<void>);
    fallback?: (e: Error) => void;
    throwError?: boolean;
    thickness?: number;
    size?: number;
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
 * ActionFab component.
 *
 * @param props - The component props.
 * @param props.className - The CSS class name for the root element.
 * @param props.style - The inline CSS styles for the root element.
 * @param props.sx - The style object for SX props.
 * @param props.noProgress - If true, the progress indicator will not be displayed when loading. Default is false.
 * @param props.throwError - If true, any error thrown during onClick will be re-thrown. Default is false.
 * @param props.disabled - If true, the component is disabled. Default is false.
 * @param props.size - The size of the component. Default is DEFAULT_SIZE.
 * @param props.thickness - The thickness of the progress indicator. Default is DEFAULT_THICKNESS.
 * @param props.color - The color of the component. Default is "primary".
 * @param props.onLoadStart - The callback function called when loading starts.
 * @param props.onLoadEnd - The callback function called when loading ends.
 * @param props.onClick - The callback function called when the component is clicked.
 * @param props.fallback - The fallback component to render if an error occurs during onClick.
 * @param props.children - The child components to render inside the component.
 * @param props.otherProps - The additional props to pass to the Fab component.
 * @returns The rendered component.
 */
export const ActionFab = ({
    className,
    style,
    sx,
    noProgress = false,
    throwError = false,
    disabled = false,
    size = DEFAULT_SIZE,
    thickness = DEFAULT_THICKNESS,
    color = "primary",
    onLoadStart,
    onLoadEnd,
    onClick = () => { },
    fallback,
    children,
    ...otherProps
}: IActionFabProps) => {

    const { classes } = useStyles();

    const [loading, setLoading] = useState(0);

    const isMounted = useRef(true);

    useLayoutEffect(() => () => {
        isMounted.current = false;
    }, []);

    const loading$ = useActualValue(loading);

    /**
     * Handles the click event of a button.
     * @param event - The click event.
     * @returns
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
                <Fab
                    {...otherProps}
                    sx={{
                        position: 'relative',
                        height: size,
                        width: size,
                        flex: 1,
                    }}
                    disabled={!!loading || disabled}
                    onClick={handleClick}
                    color={color}
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
                </Fab>
            </Box>
        </Box>
    );
};

export default ActionFab;
