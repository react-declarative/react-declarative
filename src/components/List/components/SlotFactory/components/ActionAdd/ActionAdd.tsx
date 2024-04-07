import * as React from 'react';

import { makeStyles } from '../../../../../../styles';

import Async from '../../../../../Async';

import Fab from '@mui/material/Fab';
import Button from '@mui/material/Button';

import Add from '@mui/icons-material/Add';

import useProps from "../../../../hooks/useProps";
import useReload from '../../../../hooks/useReload';
import usePayload from '../../../../hooks/usePayload';
import useCachedRows from '../../../../hooks/useCachedRows';

import useActualCallback from '../../../../../../hooks/useActualCallback';

import createValueProvider from '../../../../../../utils/createValueProvider';

import IActionAddSlot from '../../../../slots/ActionAddSlot/IActionAddSlot';

const LOAD_SOURCE = 'action-menu';
const LABEL_SHRINK = 500;

/**
 * Variable representing a function that generates custom styles using the makeStyles hook from Material-UI.
 *
 */
const useStyles = makeStyles()({
    button: {
        borderRadius: '50px !important',
        minHeight: '40px !important',
        paddingLeft: '15px !important',
        paddingRight: '15px !important',
        zIndex: 99,
    },
    fab: {
        zIndex: 99,
    },
});

const [ShrinkProvider, useShrink] = createValueProvider<boolean>();

/**
 * Represents an action slot that adds an action.
 *
 * @param props - The properties used to configure the action slot.
 * @param props.action - The name of the action.
 * @param props.width - The width of the action slot.
 * @param props.label - The label of the action button.
 * @param props.isVisible - The function used to determine if the action slot is visible.
 * @param props.isDisabled - The function used to determine if the action slot is disabled.
 *
 * @returns - The rendered action slot component.
 */
export const ActionAdd = ({
    action = 'add-action',
    width,
    label,
    isVisible = () => true,
    isDisabled = () => false,
}: IActionAddSlot) => {

    const { classes } = useStyles();
    const payload = usePayload();

    const listProps = useProps();

    const reload = useReload();

    const { selectedRows } = useCachedRows();

    const {
        fallback,
        onAction,
        onLoadStart,
        onLoadEnd,
    } = listProps;

    /**
     * Executes the click event handler.
     *
     * @param e - The event object passed to the click event handler.
     * @returns
     */
    const handleClick = useActualCallback((e: any) => {
        e.stopPropagation();
        onAction && onAction(action, selectedRows, reload);
    });

    /**
     * Function to handle the load start event.
     * @function
     * @name handleLoadStart
     *
     * @returns
     */
    const handleLoadStart = () => onLoadStart && onLoadStart(LOAD_SOURCE);
    /**
     * Handles the load end event.
     *
     */
    const handleLoadEnd = (isOk: boolean) => onLoadEnd && onLoadEnd(isOk, LOAD_SOURCE);

    /**
     * Loader component used for rendering a button or a fab based on given conditions.
     * @returns - Button or Fab component.
     */
    const Loader = () => {
        const isShrink = useShrink();
        if (label && !isShrink) {
            return (
                <Button
                    className={classes.button}
                    variant="contained"
                    size="small"
                    startIcon={<Add color="inherit" />}
                >
                    {label}
                </Button>
            )
        } else {
            return (
                <Fab className={classes.fab} disabled size="small" color="primary">
                    <Add color="inherit" />
                </Fab>
            );
        }
    };

    /**
     * Renders a button or a floating action button based on the provided props.
     *
     * @param props - The props object.
     * @param props.disabled - Whether the button is disabled.
     * @param props.onClick - The click event handler for the button.
     * @returns - The rendered button.
     */
    const Content = ({
        disabled,
        onClick,
    }: {
        disabled: boolean;
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
                    size="medium"
                    startIcon={<Add color="inherit" />}
                    onClick={onClick}
                >
                    {label}
                </Button>
            )
        } else {
            return (
                <Fab className={classes.fab} disabled={loading || disabled} size="small" color="primary" onClick={onClick}>
                    <Add color="inherit" />
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
                        );
                    } else {
                        return null;
                    }
                }}
            </Async>
        </ShrinkProvider>
    );
};

export default ActionAdd;