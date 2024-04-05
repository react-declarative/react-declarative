import * as React from 'react';
import { useState } from 'react';

import Chip, { ChipProps } from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';

import useSinglerunAction from '../../hooks/useSinglerunAction';

import Add from '@mui/icons-material/Add';
import Remove from '@mui/icons-material/Remove';

interface IActionChipProps extends Omit<ChipProps, keyof {
    variant: never;
    deleteIcon: never;
    onClick: never;
    onDelete: never;
    onChange: never;
}> {
    value?: boolean;
    onChange?: (value: boolean) => (void | Promise<void>);
    onLoadStart?: () => void;
    onLoadEnd?: (isOk: boolean) => void;
    fallback?: (e: Error) => void;
    throwError?: boolean;
}

export const ActionChip = ({
    value: upperValue = false,
    onChange,
    onLoadStart,
    onLoadEnd,
    fallback,
    throwError,
    ...otherProps
}: IActionChipProps) => {
    const [value, setValue] = useState(upperValue)

    const { loading, execute } = useSinglerunAction(async () => {
        if (onChange) {
            await onChange(!value);
        }
        setValue(!value);
    }, {
        onLoadStart,
        onLoadEnd,
        fallback,
        throwError,
    });

    if (loading) {
        return (
            <Chip
                {...otherProps}
                onDelete={() => {}}
                onClick={() => {}}
                deleteIcon={
                    <CircularProgress
                        size="12px"
                        color="inherit"
                    />
                }
                variant="filled"
            />
        );
    }

    if (value) {
        return (
            <Chip
                {...otherProps}
                onDelete={execute}
                onClick={execute}
                deleteIcon={<Remove />}
                variant="filled"
            />
        );
    }

    return (
        <Chip
            {...otherProps}
            onDelete={execute}
            onClick={execute}
            deleteIcon={<Add />}
            variant="outlined"
        />
    );
};

export default ActionChip;
