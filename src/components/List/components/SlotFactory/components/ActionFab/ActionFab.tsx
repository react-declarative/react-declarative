import * as React from 'react';

import Fab from '@mui/material/Fab';

import FolderOutlined from '@mui/icons-material/FolderOutlined';

import useProps from "../../../../hooks/useProps";
import useReload from '../../../../hooks/useReload';
import useSelection from '../../../../hooks/useSelection';

import Async from '../../../../../Async';

import IActionFabSlot from '../../../../slots/ActionFabSlot/IActionFabSlot';

const LOAD_SOURCE = 'action-menu';

const Fragment = () => <></>;

export const ActionFab = ({
    action = 'fab-action',
    icon: Icon = FolderOutlined,
    isVisible = () => true,
    isDisabled = () => false,
}: IActionFabSlot) => {

    const listProps = useProps();

    const reload = useReload();

    const { selection } = useSelection();

    const {
        rows,
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

    const selectedRows = rows.filter(({ id }) => selection.has(id));

    return (
        <Async
            Loader={Fragment}
            fallback={fallback}
            onLoadStart={handleLoadStart}
            onLoadEnd={handleLoadEnd}
            payload={selection}
        >
            {async () => {
                const visible = await isVisible(selectedRows);
                const disabled = await isDisabled(selectedRows);
                if (visible) {
                    return (
                        <Fab disabled={disabled} size="small" color="primary" onClick={handleClick}>
                            <Icon color="inherit" />
                        </Fab>
                    );
                } else {
                    return null;
                }
            }}
        </Async>
    );
};

export default ActionFab;