import * as React from 'react';
import { useState, useMemo } from 'react';

import Chip, { ChipProps } from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';

import useSinglerunAction from '../../hooks/useSinglerunAction';

import Add from '@mui/icons-material/Add';
import Remove from '@mui/icons-material/Remove';

/**
 * Interface representing the props for the ActionChip component.
 *
 * @interface
 * @extends ChipProps
 * @property withSingleValue - Determines whether the action chip should display a single value.
 * @property value - The current value of the action chip.
 * @property onChange - The function to be called when the value of the action chip changes.
 * @property onLoadStart - The function to be called when the loading starts.
 * @property onLoadEnd - The function to be called when the loading ends.
 * @property fallback - The function to be called if an error occurs.
 * @property throwError - Determines whether an error should be thrown.
 */
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

/**
 * ActionChip component represents a chip with dynamic action behavior.
 *
 * @param [value=false] - The initial value of the chip.
 * @param [withSingleValue=false] - Determines whether the chip should have a single value or not.
 * @param [onChange] - The function to be called when the chip value changes.
 * @param [onLoadStart] - The function to be called when the chip's loading state starts.
 * @param [onLoadEnd] - The function to be called when the chip's loading state ends.
 * @param [fallback] - The fallback content to be displayed while the chip is in the loading state.
 * @param [throwError] - Determines whether an error should be thrown if the onChange function is not defined.
 * @param [otherProps] - Additional props to be passed to the Chip component.
 *
 * @returns - The ActionChip component.
 */
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

    /**
     * A variable that uses the `useMemo` hook to conditionally return an object with properties.
     * If the `withSingleValue` is truthy, it returns an empty object.
     * Otherwise, it returns an object with `onDelete` and `deleteIcon` properties.
     */
    const removeProps = useMemo(() => {
        if (withSingleValue) {
            return {};
        }
        return {
            onDelete: execute,
            deleteIcon: <Remove />,
        };
    }, []);

    /**
     * Returns an object with properties to be added based on specific conditions.
     */
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
