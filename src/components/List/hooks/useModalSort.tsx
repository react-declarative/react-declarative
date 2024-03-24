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

/**
 * Represents the properties for the ModalSortProvider component.
 */
interface IModalSortProviderProps {
    children: React.ReactNode;
}

/**
 * The InternalProvider component is responsible for providing sorting functionality
 * to its children components.
 *
 * @param props - The props for the InternalProvider component.
 * @param props.children - The children components.
 * @returns - The rendered InternalProvider component.
 */
const InternalProvider = ({
    children,
}: IModalSortProviderProps) => {

    const { columns: listColumns } = useProps();

    /**
     * Retrieves sortable columns from a given list of columns.
     *
     * @returns {Array} The list of sortable columns.
     */
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

    /**
     * Function that handles the modal by calling the showModal function.
     *
     * @function handleModal
     * @returns
     */
    const handleModal = () => showModal();

    return (
        <ModalSortContext.Provider value={handleModal}>
            {children}
        </ModalSortContext.Provider>
    );
};

/**
 * ModalSortProvider is a component that acts as a provider for sorting modal functionality.
 * It wraps the children components with the necessary providers to enable modal sorting.
 *
 * @param props - The component props.
 * @param props.children - The child components to be wrapped by the modal sorting providers.
 * @returns - The wrapped child components with modal sorting providers.
 */
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
