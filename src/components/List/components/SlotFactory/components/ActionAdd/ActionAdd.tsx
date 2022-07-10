import * as React from 'react';

import { makeStyles } from '../../../../../../styles';

import Async from '../../../../../Async';

import Fab from '@mui/material/Fab';
import Button from '@mui/material/Button';

import Add from '@mui/icons-material/Add';

import useProps from "../../../../hooks/useProps";
import useReload from '../../../../hooks/useReload';
import useCachedRows from '../../../../hooks/useCachedRows';

import useActualCallback from '../../../../../../hooks/useActualCallback';

import IActionAddSlot from '../../../../slots/ActionAddSlot/IActionAddSlot';

const LOAD_SOURCE = 'action-menu';

const useStyles = makeStyles({
    button: {
        borderRadius: '50px !important',
        minHeight: '40px !important',
    },
});

export const ActionAdd = ({
    action = 'add-action',
    label,
    isVisible = () => true,
    isDisabled = () => false,
}: IActionAddSlot) => {

    const classes = useStyles();

    const listProps = useProps();

    const reload = useReload();

    const { selectedRows } = useCachedRows();

    const {
        fallback,
        onAction,
        onLoadStart,
        onLoadEnd,
    } = listProps;

    const handleClick = useActualCallback((e: any) => {
        e.stopPropagation();
        onAction && onAction(action, selectedRows, reload);
    });

    const handleLoadStart = () => onLoadStart && onLoadStart(LOAD_SOURCE);
    const handleLoadEnd = (isOk: boolean) => onLoadEnd && onLoadEnd(isOk, LOAD_SOURCE);

    const Loader = () => {
        if (label) {
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
                <Fab disabled size="small" color="primary">
                    <Add color="inherit" />
                </Fab>
            );
        }
    };

    const Content = ({
        disabled,
        onClick,
    }: {
        disabled: boolean;
        onClick: (e: any) => void;
    }) => {
        const { loading } = useProps();
        if (label) {
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
                <Fab disabled={loading || disabled} size="medium" color="primary" onClick={onClick}>
                    <Add color="inherit" />
                </Fab>
            );
        }
    };

    return (
        <Async
            Loader={Loader}
            fallback={fallback}
            onLoadStart={handleLoadStart}
            onLoadEnd={handleLoadEnd}
            payload={selectedRows}
            throwError
        >
            {async () => {
                const visible = await isVisible(selectedRows);
                const disabled = await isDisabled(selectedRows);
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
    );
};

export default ActionAdd;