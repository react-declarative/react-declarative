import * as React from 'react';
import { useMemo, useContext } from 'react';
import { createContext } from 'react';

import SortModal from '../components/SortModal';

import ModalProvider from '../../ModalProvider';

import { useModal } from '../../ModalProvider';

import ColumnType from '../../../model/ColumnType';

import useProps from '../hooks/useProps';

export const useModalSort = () => useContext(ModalSortContext);

const ModalSortContext = createContext<() => void>(null as never);

interface IModalSortProviderProps {
    children: React.ReactNode;
}

const InternalProvider = ({
    children,
}: IModalSortProviderProps) => {

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

    const handleModal = () => showModal();

    return (
        <ModalSortContext.Provider value={handleModal}>
            {children}
        </ModalSortContext.Provider>
    );
};

export const ModalSortProvider = ({
    children,
}: IModalSortProviderProps) => (
    <ModalProvider>
        <InternalProvider>
            {children}
        </InternalProvider>
    </ModalProvider>
);

export default useModalSort;
