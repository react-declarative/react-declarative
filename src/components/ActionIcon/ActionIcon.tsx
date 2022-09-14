import * as React from 'react';
import { useState, useRef, useLayoutEffect } from 'react';

import CircularProgress from '@mui/material/CircularProgress';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';

import useActualValue from '../../hooks/useActualValue';

interface IActionIconProps extends Omit<IconButtonProps, keyof {
    onClick: never;
}> {
    onLoadStart?: () => void;
    onLoadEnd?: (isOk: boolean) => void;
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void | Promise<void>;
    fallback?: (e: Error) => void;
    throwError?: boolean;
};

export const ActionIcon = ({
    onClick = () => { },
    onLoadStart,
    onLoadEnd,
    fallback,
    children,
    disabled,
    throwError = false,
    ...otherProps
}: IActionIconProps) => {

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
            onClick={handleClick}
            disabled={!!loading || disabled}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                ...otherProps.sx,
            }}
        >
            {loading ? (
                <CircularProgress
                    size="24px"
                    color="inherit"
                />
            ) : (
                <>
                    {children}
                </>
            )}
        </IconButton>
    );
};

export default ActionIcon;
