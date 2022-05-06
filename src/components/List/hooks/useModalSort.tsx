import * as React from 'react';
import { useMemo } from 'react';

import SortModal from '../components/SortModal';

import { useModal } from '../../ModalProvider';

import ColumnType from '../../../model/ColumnType';

import useProps from '../hooks/useProps';

export const useModalSort = () => {

    const { columns: listColumns } = useProps();

    const columns = useMemo(() => {
        return listColumns.filter((column) => {
            let isSortable = !!column.field;
            isSortable = isSortable && column.sortable !== false;
            isSortable = isSortable && column.type !== ColumnType.Action;
            return isSortable;
        });
    }, []);

    const { showModal, hideModal } = useModal(() => (
        <SortModal
            columns={columns}
            onClose={() => hideModal()}
        />
    ), []);

    return showModal;
};

export default useModalSort;
