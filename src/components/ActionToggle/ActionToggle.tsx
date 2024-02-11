import * as React from 'react';
import { useState, useEffect, useRef, useLayoutEffect } from 'react';

import { SxProps } from "@mui/material";
import { makeStyles } from "../../styles";

import Box, { BoxProps } from '@mui/material/Box';
import Switch from '@mui/material/Switch';

import classNames from "../../utils/classNames";

import useActualValue from '../../hooks/useActualValue';

interface IActionToggleProps extends Omit<BoxProps, keyof {
    onChange: never;
    onClick: never;
    sx?: never;
}> {
    onLoadStart?: () => void;
    onLoadEnd?: (isOk: boolean) => void;
    onClick?: (value: boolean) => (void | Promise<void>);
    fallback?: (e: Error) => void;
    checked?: boolean;
    disabled?: boolean;
    defaultChecked?: boolean;
    throwError?: boolean;
    sx?: SxProps<any>;
};

const useStyles = makeStyles()({
    root: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        '& > *': {
            pointerEvents: 'none',
            touchAction: 'none',
        },
    },
    disabled: {
        opacity: 0.5,
    },
    active: {
        cursor: 'pointer',
    },
});

export const ActionToggle = ({
    className,
    onClick = () => { },
    onLoadStart,
    onLoadEnd,
    fallback,
    disabled,
    throwError = false,
    checked: upperChecked = false,
    defaultChecked = false,
    ...otherProps
}: IActionToggleProps) => {

    const { classes } = useStyles();

    const [loading, setLoading] = useState(0);
    const [checked, setChecked] = useState(upperChecked || defaultChecked);

    const isMounted = useRef(true);

    useLayoutEffect(() => () => {
      isMounted.current = false;
    }, []);

    useEffect(() => {
        setChecked(upperChecked);
    }, [upperChecked]);

    const loading$ = useActualValue(loading);
    const checked$ = useActualValue(checked);

    const handleChange = async () => {
        const { current: loading } = loading$;
        const { current: checked } = checked$;
        if (loading) {
            return;
        }
        let isOk = true;
        try {
            onLoadStart && onLoadStart();
            isMounted.current && setLoading((loading) => loading + 1);
            await onClick(!checked);
            isMounted.current && setChecked(!checked);
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

    const isDisabled = !!loading || disabled;

    return (
        <Box
            {...otherProps}
            className={classNames(className, classes.root, {
                [classes.disabled]: isDisabled,
                [classes.active]: !isDisabled,
            })}
            onClick={handleChange}
        >
            <Switch
                disabled={isDisabled}
                checked={checked}
            />
        </Box>
    );
};

export default ActionToggle;
