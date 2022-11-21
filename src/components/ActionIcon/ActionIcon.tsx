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

const useStyles = makeStyles<{
    size: number;
    thickness: number;
}>()((_, {
    size,
    // thickness,
}) => ({
    root: {
        display: 'inline-flex',
        position: 'relative',
        height: size,
        width: size,
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
        <IconButton
            {...otherProps}
            className={classNames(className, classes.root)}
            style={style}
            sx={sx}
            disabled={!!loading || disabled}
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
    );
};

export default ActionIcon;
