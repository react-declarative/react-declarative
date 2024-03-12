import { useCallback, useState } from "react";

/**
 * Hook for managing grid selection.
 *
 * @returns {Object} - An object containing the following properties:
 *  - selectedRows: Array of selected row IDs.
 *  - gridProps: Object with properties for grid selection:
 *    - selectedRows: Array of selected row IDs.
 *    - onSelectedRows: Function to handle selected row IDs.
 *  - deselectAll: Function to clear all selected rows.
 */
export const useGridSelection = () => {
    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    const deselectAll = useCallback(() => setSelectedRows([]), []);
    return {
        selectedRows,
        gridProps: {
            selectedRows,
            onSelectedRows: (rowIds: string[]) => setSelectedRows(rowIds),
        },
        deselectAll,
    } as const;
}

export default useGridSelection;
