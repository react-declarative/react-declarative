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

const useStyles = makeStyles<{
    size: number;
    thickness: number;
}>()((_, { size }) => ({
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
            <Fab
                {...otherProps}
                className={classes.container}
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
    );
};

export default ActionFab;
