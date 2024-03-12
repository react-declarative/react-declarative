import * as React from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

import Async from '../Async';
import ActionButton from '../ActionButton';

import useActualCallback from '../../hooks/useActualCallback';

import IActionTriggerProps from './model/IActionTriggerProps';

/**
 * Renders a component that triggers actions based on user interaction.
 *
 * @template T - The type of the payload returned by the action.
 * @param {Object} props - The props for the component.
 * @param {Array<Object>} props.actions - An array of objects representing the actions to be triggered. Each object should have the following properties:
 *   - action: The name of the action to be triggered.
 *   - label: The label of the action.
 *   - icon: An optional icon component for the action.
 *   - isAvailable: An optional function or boolean indicating whether the action is available. If a function is provided, it should return a boolean.
 * @param {string} [props.variant='outlined'] - The variant of the action buttons.
 * @param {string} [props.size='medium'] - The size of the action buttons.
 * @param {Function} [props.onAction=() => {}] - The callback function to be called when an action is triggered.
 * @param {*} [props.fallback] - The fallback value to be passed to the Async component.
 * @param {Function} [props.onLoadStart] - The callback function to be called when the async operation starts.
 * @param {Function} [props.onLoadEnd] - The callback function to be called when the async operation ends.
 * @param {*} [props.payload] - The payload data to be passed to the async operation.
 * @param {Array} [props.deps] - The dependencies of the async operation.
 * @param {boolean} [props.throwError] - Whether to throw an error if the async operation fails.
 * @param {Object} otherProps - Additional props to be spread onto the container Box component.
 * @returns {React.ReactNode} - The rendered component.
 */
export const ActionTrigger = <T extends any = object>({
    actions,
    variant = 'outlined',
    size = 'medium',
    onAction = () => { },

    fallback,
    onLoadStart,
    onLoadEnd,
    payload,
    deps,
    throwError,

    ...otherProps
}: IActionTriggerProps<T>) => {

    const onAction$ = useActualCallback(onAction);

    const asyncProps = {
        fallback,
        onLoadStart,
        onLoadEnd,
        payload,
        deps,
        throwError,
    };

    const Loader = () => (
        <>
            {actions.map(({ label, icon: Icon }, idx) => (
                <Button
                    disabled
                    key={idx}
                    size={size}
                    variant={variant}
                    startIcon={Icon && <Icon />}
                    sx={{
                        minWidth: {
                            xs: '100%',
                            sm: 175,
                        }
                    }}
                >
                    <Stack direction="row" alignItems="center" spacing={1}>
                            <Box display="flex" alignItems="center">
                                <CircularProgress
                                    size="16px"
                                    color="inherit"
                                />
                            </Box>
                        <Box>
                            {label}
                        </Box>
                    </Stack>
                </Button>
            ))}
        </>
    );

    const createTriggerHandler = (action: string) => async () => await onAction$(action);

    const Trigger = ({
        action,
        available,
        label,
        icon: Icon,
    }: {
        action: string;
        available: boolean;
        label: string;
        icon?: React.ComponentType<any>;
    }) => (
        <ActionButton
            {...asyncProps}
            disabled={!available}
            size={size}
            variant={variant}
            startIcon={Icon && <Icon />}
            onClick={createTriggerHandler(action)}
            sx={{
                minWidth: {
                    xs: '100%',
                    sm: 175,
                }
            }}
        >
            {label}
        </ActionButton>
    );

    return (
        <Box
            {...otherProps}
            sx={{
                ...otherProps.sx,
                display: 'flex',
                alignItems: 'center',
                flexDirection: {
                    xs: 'column',
                    sm: 'row',
                },
                gap: 1,
            }}
        >
            <Async<T>
                Loader={Loader}
                {...asyncProps}
            >
                {async (payload) => {
                    return await Promise.all(actions.map(async ({
                        action = "unknown-action",
                        label = "Unknown",
                        icon,
                        isAvailable = true,
                    }, idx) => {
                        const handleAvailable = () => typeof isAvailable === 'function'
                            ? isAvailable(payload)
                            : isAvailable;
                        const available = await handleAvailable();
                        return (
                            <Trigger
                                key={idx}
                                action={action}
                                available={available}
                                label={label}
                                icon={icon}
                            />
                        );
                    }));
                }}
            </Async>
        </Box>
    );
};

export default ActionTrigger;
