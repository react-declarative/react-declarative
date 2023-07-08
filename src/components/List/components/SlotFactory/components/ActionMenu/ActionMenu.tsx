import * as React from 'react';

import BaseActionMenu from '../../../../../ActionMenu';

import CleaningServices from '@mui/icons-material/CleaningServicesOutlined';
import Refresh from '@mui/icons-material/Refresh';
import Sort from '@mui/icons-material/Sort';

import useProps from "../../../../hooks/useProps";
import usePayload from '../../../../hooks/usePayload';
import useModalSort from '../../../../hooks/useModalSort';
import useReload from '../../../../hooks/useReload';
import useCachedRows from '../../../../hooks/useCachedRows';
import useDropFilters from '../../../../hooks/useDropFilters';

import useActualCallback from '../../../../../../hooks/useActualCallback';

import IActionMenuSlot from '../../../../slots/ActionMenuSlot/IActionMenuSlot';

const LOAD_SOURCE = 'action-menu';

export const ActionMenu = ({
    options = [],
    deps = [],
}: IActionMenuSlot) => {

    const { selectedRows } = useCachedRows();

    const showSortModal = useModalSort();
    const dropFilters = useDropFilters();
    const reloadList = useReload();
    const payload = usePayload();

    const {
        onAction,
        fallback,
        onLoadStart,
        onLoadEnd,
        loading,
    } = useProps();

    const handleAction = useActualCallback((action: string) => {
        if (action === 'update-now') {
            reloadList();
        } else if (action === 'resort-action') {
            showSortModal();
        } else if (action === 'drop-filters') {
            dropFilters();
        }
        onAction && onAction(action, selectedRows, reloadList);
    });

    const handleLoadStart = () => onLoadStart && onLoadStart(LOAD_SOURCE);
    const handleLoadEnd = (isOk: boolean) => onLoadEnd && onLoadEnd(isOk, LOAD_SOURCE);

    return (
        <BaseActionMenu
            options={options.map(({
                action,
                isDisabled = () => false,
                isVisible = () => true,
                ...other
            }) => {
                if (action === 'update-now') {
                    return {
                        action,
                        ...other,
                        icon: Refresh,
                        isDisabled: () => isDisabled(selectedRows, payload),
                        isVisible: () => isVisible(selectedRows, payload),
                        label: 'Refresh manually'
                    }
                } else if (action === 'resort-action') {
                    return {
                        action,
                        ...other,
                        icon: Sort,
                        isDisabled: () => isDisabled(selectedRows, payload),
                        isVisible: () => isVisible(selectedRows, payload),
                        label: 'Change sort order'
                    }
                } else if (action === 'drop-filters') {
                    return {
                        action,
                        ...other,
                        icon: CleaningServices,
                        isDisabled: () => isDisabled(selectedRows, payload),
                        isVisible: () => isVisible(selectedRows, payload),
                        label: 'Drop filters'
                    }
                } else {
                    return {
                        action,
                        ...other,
                        isDisabled: () => isDisabled(selectedRows, payload),
                        isVisible: () => isVisible(selectedRows, payload),
                    }
                }
            })}
            onAction={handleAction}
            fallback={fallback}
            payload={selectedRows}
            deps={[...deps, payload]}
            onLoadStart={handleLoadStart}
            onLoadEnd={handleLoadEnd}
            disabled={loading}
        />
    );
}

export default ActionMenu;