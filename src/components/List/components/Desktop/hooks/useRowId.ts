import { useRef, useLayoutEffect } from 'react';

const GRID_ROW = ".MuiDataGrid-row[data-id]";

export const useRowId = (setRowId: (rowId: string) => void) => {
    const observerRef = useRef<MutationObserver | null>(null);

    const handleCleanup = () => {
        const { current: observer } = observerRef;
        if (observer) {
            observer.disconnect();
            observerRef.current = null;
        }
    };

    const handleRowId = (instance: HTMLElement) => {
        const target = instance.closest<HTMLElement>(GRID_ROW);
        const rowId = target?.dataset?.id;
        rowId && setRowId(rowId);
    };

    useLayoutEffect(() => handleCleanup, []);

    return (instance: HTMLElement) => {
        const observer = new MutationObserver(() => handleRowId(instance));
        observerRef.current = observer;
        observer.observe(instance, {
            subtree: true,
            childList: true,
            attributes: true,
        });
        handleCleanup();
        handleRowId(instance);
    };

};

export default useRowId;
