import * as React from 'react';

import BaseActionMenu from '../../../../../ActionMenu';

import Refresh from '@mui/icons-material/Refresh';
import Sort from '@mui/icons-material/Sort';

import useProps from "../../../../hooks/useProps";
import useModalSort from '../../../../hooks/useModalSort';
import useReload from '../../../../hooks/useReload';
import useSelection from '../../../../hooks/useSelection';

import IActionMenuSlot from '../../../../slots/ActionMenuSlot/IActionMenuSlot';

const LOAD_SOURCE = 'action-menu';

export const ActionMenu = ({
    options = [],
}: IActionMenuSlot) => {

    const { selection } = useSelection();

    const showSortModal = useModalSort();
    const reloadList = useReload();

    const {
        onAction,
        fallback,
        rows,
        onLoadStart,
        onLoadEnd,
    } = useProps();

    const handleAction = (action: string) => {
        if (action === 'update-now') {
            reloadList();
        } else if (action === 'resort-action') {
            showSortModal();
        }
        onAction && onAction(action, selectedRows, reloadList);
    };

    const handleLoadStart = () => onLoadStart && onLoadStart(LOAD_SOURCE);
    const handleLoadEnd = (isOk: boolean) => onLoadEnd && onLoadEnd(isOk, LOAD_SOURCE);

    const selectedRows = rows.filter(({ id }) => selection.has(id));

    return (
        <BaseActionMenu
            options={options.map(({
                action,
                isDisabled = () => true,
                isVisible = () => true,
                ...other
            }) => {
                if (action === 'update-now') {
                    return {
                        action,
                        ...other,
                        icon: Refresh,
                        isDisabled: () => isDisabled(selectedRows),
                        isVisible: () => isVisible(selectedRows),
                        label: 'Refresh manually'
                    }
                } else if (action === 'resort-action') {
                    return {
                        action,
                        ...other,
                        icon: Sort,
                        isDisabled: () => isDisabled(selectedRows),
                        isVisible: () => isVisible(selectedRows),
                        label: 'Change sort order'
                    }
                } else {
                    return {
                        action,
                        ...other,
                        isDisabled: () => isDisabled(selectedRows),
                        isVisible: () => isVisible(selectedRows),
                    }
                }
            })}
            onAction={handleAction}
            fallback={fallback}
            payload={selection}
            onLoadStart={handleLoadStart}
            onLoadEnd={handleLoadEnd}
        />
    );
}

export default ActionMenu;