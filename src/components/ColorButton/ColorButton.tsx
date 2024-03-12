import * as React from 'react';
import { useMemo, useRef, useState, useEffect } from 'react';

import { makeStyles } from '../../styles';

import Box, { BoxProps } from '@mui/material/Box';

import useActualCallback from '../../hooks/useActualCallback';
import useChange from '../../hooks/useChange';

import classNames from '../../utils/classNames';
import debounce from '../../utils/hof/debounce'

import PaletteIcon from '@mui/icons-material/Palette';

interface IColorButtonProps extends Omit<BoxProps, keyof {
    value: never;
    onChange: never;
    onClick: never;
}> {
    value?: string;
    onChange?: (color: string) => void;
}

const CHANGE_DEBOUNCE = 500;

const useStyles = makeStyles()((theme) => ({
    root: {
        color: theme.palette.action.active,
        cursor: 'pointer',
        transition: "color 500ms",
        borderRadius: '50%',
        padding: 0,
    },
    input: {
        visibility: 'hidden',
        height: 0,
        width: 0,
        maxHeight: 0,
        maxWidth: 0,
    },
}));

/**
 * Represents a color button component.
 * @typedef {Object} IColorButtonProps
 * @property {string} className - The class name for the color button.
 * @property {string} value - The initial value for the color button (default: "").
 * @property {Object} sx - The style object for the color button.
 * @property {function} onChange - The function to be called when the color button value changes (default: () => null).
 */
export const ColorButton = ({
    className,
    value: upperValue = "",
    sx,
    onChange = () => null,
    ...props
}: IColorButtonProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const { classes } = useStyles();

    const [value, setValue] = useState(upperValue);

    useChange(() => {
        setValue(upperValue);
    }, [upperValue]);

    const onChange$ = useActualCallback(onChange);

    const handleChange = useMemo(() => debounce((value) => {
        onChange$(value);
        setValue(value);
    }, CHANGE_DEBOUNCE), []);

    useEffect(() => () => {
        handleChange.clear();
    }, []);

    return (
        <Box
            {...props}
            className={classNames(classes.root, className)}
            onClick={() => inputRef.current?.click()}
            style={{
                color: value,
            }}
        >
            <PaletteIcon />
            <input className={classes.input} ref={inputRef} type="color" onChange={({ target }) => handleChange(target.value)} />
        </Box>
    );
};

export default ColorButton;
