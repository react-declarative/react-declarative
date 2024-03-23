import * as React from 'react';

import { makeStyles } from '../../../../../../styles';

import Async from '../../../../../Async';

import Fab from '@mui/material/Fab';
import Button from '@mui/material/Button';

import SettingsIcon from '@mui/icons-material/Settings';

import useProps from "../../../../hooks/useProps";
import useReload from '../../../../hooks/useReload';
import useCachedRows from '../../../../hooks/useCachedRows';
import usePayload from '../../../../hooks/usePayload';

import useActualCallback from '../../../../../../hooks/useActualCallback';

import createValueProvider from '../../../../../../utils/createValueProvider';

import IActionFabSlot from '../../../../slots/ActionFabSlot/IActionFabSlot';

const LOAD_SOURCE = 'action-menu';
const LABEL_SHRINK = 500;

const useStyles = makeStyles()({
    button: {
        borderRadius: '50px !important',
        minHeight: '40px !important',
        paddingLeft: '15px !important',
        paddingRight: '15px !important',
    },
    fab: {
        zIndex: 99,
    },
});

const [ShrinkProvider, useShrink] = createValueProvider<boolean>();

/**
 * Renders an action FAB (Floating Action Button) component
 *
 * @param options - The options for the action FAB
 * @param options.action - The name of the action
 * @param options.label - The label for the button
 * @param options.width - The width of the component
 * @param options.icon - The icon component to display
 * @param options.isVisible - A function that returns a boolean indicating if the FAB is visible
 * @param options.isDisabled - A function that returns a boolean indicating if the FAB is disabled
 *
 * @returns The rendered action FAB component
 */
export const ActionFab = ({
    action = 'fab-action',
    label,
    width,
    icon: Icon = SettingsIcon,
    isVisible = () => true,
    isDisabled = () => false,
}: IActionFabSlot) => {

    const { classes } = useStyles();

    const listProps = useProps();
    const payload = usePayload();

    const reload = useReload();

    const { selectedRows } = useCachedRows();

    const {
        fallback,
        onAction,
        onLoadStart,
        onLoadEnd,
    } = listProps;

    /**
     * Sets up a click event handler for a given element.
     *
     * @param {function} callback - The callback function to be executed when the element is clicked.
     * @param {Event} e - The event object passed to the callback function.
     * @returns {void}
     */
    const handleClick = useActualCallback((e: any) => {
        e.stopPropagation();
        onAction && onAction(action, selectedRows, reload);
    });

    /**
     * A function that handles the load start event.
     *
     * @function
     * @name handleLoadStart
     *
     * @returns
     *
     * @example
     * handleLoadStart();
     */
    const handleLoadStart = () => onLoadStart && onLoadStart(LOAD_SOURCE);
    /**
     * Function to handle the load end event.
     *
     * @param isOk - Flag indicates if the load was successful.
     */
    const handleLoadEnd = (isOk: boolean) => onLoadEnd && onLoadEnd(isOk, LOAD_SOURCE);

    /**
     * Represents a Loader component that renders a Button or a Fab based on certain conditions.
     * @constructor
     * @global
     */
    const Loader = () => {
        const isShrink = useShrink();
        if (label && !isShrink) {
            return (
                <Button
                    className={classes.button}
                    variant="contained"
                    size="small"
                    startIcon={<Icon color="inherit" />}
                >
                    {label}
                </Button>
            )
        } else {
            return (
                <Fab className={classes.fab} disabled size="small" color="primary">
                    <Icon color="inherit" />
                </Fab>
            );
        }
    };

    const Content = ({
        disabled,
        onClick,
    }: {
        disabled: boolean
        onClick: (e: any) => void;
    }) => {
        const isShrink = useShrink();
        const { loading } = useProps();
        if (label && !isShrink) {
            return (
                <Button
                    className={classes.button}
                    variant="contained"
                    disabled={loading || disabled}
                    size="small"
                    startIcon={<Icon color="inherit" />}
                    onClick={onClick}
                >
                    {label}
                </Button>
            )
        } else {
            return (
                <Fab className={classes.fab} disabled={loading || disabled} size="small" color="primary" onClick={onClick}>
                    <Icon color="inherit" />
                </Fab>
            );
        }
    };

    const isShrink = width < LABEL_SHRINK;

    return (
        <ShrinkProvider payload={isShrink}>
            <Async
                Loader={Loader}
                fallback={fallback}
                onLoadStart={handleLoadStart}
                onLoadEnd={handleLoadEnd}
                payload={selectedRows}
                deps={[payload]}
                throwError
            >
                {async () => {
                    const visible = await isVisible(selectedRows, payload);
                    const disabled = await isDisabled(selectedRows, payload);
                    if (visible) {
                        return (
                            <Content
                                disabled={disabled}
                                onClick={handleClick}
                            />
                        )
                    } else {
                        return null;
                    }
                }}
            </Async>
        </ShrinkProvider>
    );
};

export default ActionFab;