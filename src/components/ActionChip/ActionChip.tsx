import * as React from 'react';
import { useState, useMemo } from 'react';

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
    withSingleValue?: boolean;
    value?: boolean;
    onChange?: (value: boolean) => (void | boolean | undefined | Promise<void | boolean | undefined>);
    onLoadStart?: () => void;
    onLoadEnd?: (isOk: boolean) => void;
    fallback?: (e: Error) => void;
    throwError?: boolean;
}

export const ActionChip = ({
    value: upperValue = false,
    withSingleValue = false,
    onChange,
    onLoadStart,
    onLoadEnd,
    fallback,
    throwError,
    ...otherProps
}: IActionChipProps) => {
    const [value, setValue] = useState(() => withSingleValue ? true : upperValue)

    const { loading, execute } = useSinglerunAction(async () => {
        let result: Awaited<ReturnType<Exclude<typeof onChange, undefined>>>;
        if (onChange) {
            result = await onChange(!value);
        }
        if (!withSingleValue) {
            setValue(typeof result === 'boolean' ? result : !value);
        }
    }, {
        onLoadStart,
        onLoadEnd,
        fallback,
        throwError,
    });

    const removeProps = useMemo(() => {
        if (withSingleValue) {
            return {};
        }
        return {
            onDelete: execute,
            deleteIcon: <Remove />,
        };
    }, []);

    const addProps = useMemo(() => {
        if (withSingleValue) {
            return {};
        }
        return {
            onDelete: execute,
            deleteIcon: <Add />,
        };
    }, []);

    if (loading) {
        return (
            <Chip
                {...otherProps}
                onClick={() => {}}
                onDelete={() => {}}
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
                onClick={execute}
                {...removeProps}
                variant="filled"
            />
        );
    }

    return (
        <Chip
            {...otherProps}
            onClick={execute}
            {...addProps}
            variant="outlined"
        />
    );
};

export default ActionChip;
