import * as React from 'react';
import { useState, useRef, useLayoutEffect } from 'react';

import CircularProgress from '@mui/material/CircularProgress';
import Button, { ButtonProps } from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

import useActualValue from '../../hooks/useActualValue';

const ProgressDefault = ({
    loading,
    children,
}: {
    children: React.ReactNode;
    loading: boolean;
}) => (
    <Stack direction="row" alignItems="center" spacing={1}>
        {!!loading && (
            <Box display="flex" alignItems="center">
                <CircularProgress
                    size="16px"
                    color="inherit"
                />
            </Box>
        )}
        <Box>
            {children}
        </Box>
    </Stack>
);

interface IActionButtonProps extends Omit<ButtonProps, keyof {
    onClick: never;
}> {
    Progress?: typeof ProgressDefault;
    onLoadStart?: () => void;
    onLoadEnd?: (isOk: boolean) => void;
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => (void | Promise<void>);
    fallback?: (e: Error) => void;
    throwError?: boolean;
};

/**
 * Represents an action button component.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {React.ReactNode} [props.Progress=ProgressDefault] - The progress component to show when the button is loading.
 * @param {Function} [props.onClick=()=>{}] - The function to be called when the button is clicked.
 * @param {Function} [props.onLoadStart] - The function to be called when the loading starts.
 * @param {Function} [props.onLoadEnd] - The function to be called when the loading ends.
 * @param {Function} [props.fallback] - The function to be called when an error occurs and throwError is false.
 * @param {React.ReactNode} [props.children] - The content to be rendered inside the button.
 * @param {boolean} [props.disabled] - Whether the button is disabled.
 * @param {boolean} [props.throwError=false] - Whether to throw an error when an exception occurs.
 * @param {string} [props.variant="outlined"] - The button style variant.
 *
 * @returns {React.ReactElement} The rendered component.
 */
export const ActionButton = ({
    Progress = ProgressDefault,
    onClick = () => { },
    onLoadStart,
    onLoadEnd,
    fallback,
    children,
    disabled,
    throwError = false,
    variant = "outlined",
    ...otherProps
}: IActionButtonProps) => {

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
        <Button
            {...otherProps}
            onClick={handleClick}
            disabled={!!loading || disabled}
            variant={variant}
        >
            <Progress loading={!!loading}>
                {children}
            </Progress>
        </Button>
    );
};

export default ActionButton;
