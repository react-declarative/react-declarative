import * as React from 'react';

import Fab from '@mui/material/Fab';

import Add from '@mui/icons-material/Add';

import useProps from "../../../../hooks/useProps";
import useReload from '../../../../hooks/useReload';
import useCachedRows from '../../../../hooks/useCachedRows';

import Async from '../../../../../Async';

import IActionAddSlot from '../../../../slots/ActionAddSlot/IActionAddSlot';

const LOAD_SOURCE = 'action-menu';

const Fragment = () => <></>;

export const ActionAdd = ({
    action = 'add-action',
    isVisible = () => true,
    isDisabled = () => false,
}: IActionAddSlot) => {

    const listProps = useProps();

    const reload = useReload();

    const { selectedRows } = useCachedRows();

    const {
        fallback,
        onAction,
        onLoadStart,
        onLoadEnd,
    } = listProps;

    const handleClick = (e: any) => {
        e.stopPropagation();
        onAction && onAction(action, selectedRows, reload);
    };

    const handleLoadStart = () => onLoadStart && onLoadStart(LOAD_SOURCE);
    const handleLoadEnd = (isOk: boolean) => onLoadEnd && onLoadEnd(isOk, LOAD_SOURCE);

    const Content = ({
        disabled,
        onClick,
    }: {
        disabled: boolean;
        onClick: (e: any) => void;
    }) => {
        const { loading } = useProps();
        return (
            <Fab disabled={loading || disabled} size="small" color="primary" onClick={onClick}>
                <Add color="inherit" />
            </Fab>
        );
    };

    return (
        <Async
            Loader={Fragment}
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