import * as React from 'react';

import BaseActionMenu from '../../../../../ActionMenu';

import Refresh from '@mui/icons-material/Refresh';
import Sort from '@mui/icons-material/Sort';

import useProps from "../../../../hooks/useProps";
import useModalSort from '../../../../hooks/useModalSort';
import useReload from '../../../../hooks/useReload';

import IActionMenuSlot from '../../../../slots/ActionMenuSlot/IActionMenuSlot';

export const ActionMenu = ({
    options = [],
}: IActionMenuSlot) => {

    const showSortModal = useModalSort();
    const reloadList = useReload();

    const {
        onAction,
        fallback,
    } = useProps();

    const handleAction = (action: string) => {
        if (action === 'update-now') {
            reloadList();
        } else if (action === 'resort-action') {
            showSortModal();
        }
        onAction && onAction(action);
    };

    return (
        <BaseActionMenu
            options={options.map(({
                action,
                ...other
            }) => {
                if (action === 'update-now') {
                    return {
                        ...other,
                        action,
                        icon: Refresh,
                        label: 'Refresh manually'
                    }
                } else if (action === 'resort-action') {
                    return {
                        ...other,
                        action,
                        icon: Sort,
                        label: 'Change sort order'
                    }
                } else {
                    return {
                        action,
                        ...other
                    }
                }
            })}
            onAction={handleAction}
            fallback={fallback}
        />
    );
}

export default ActionMenu;