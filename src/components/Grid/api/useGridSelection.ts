import { useCallback, useState } from "react";

import useChange from "../../../hooks/useChange";

/**
 * Represents the interface for the params.
 * @interface
 */
interface IParams {
    selectedRows?: string[];
    onChange: (selectedRows: string[]) => void;
}

/**
 * Hook for managing grid selection.
 *
 * @returns - An object containing the following properties:
 *  - selectedRows: Array of selected row IDs.
 *  - gridProps: Object with properties for grid selection:
 *    - selectedRows: Array of selected row IDs.
 *    - onSelectedRows: Function to handle selected row IDs.
 *  - deselectAll: Function to clear all selected rows.
 */
export const useGridSelection = ({
    selectedRows: defaultSelectedRows = [],
    onChange,
}: Partial<IParams> = {}) => {
    const [selectedRows, setSelectedRows] = useState<string[]>(defaultSelectedRows);
    const deselectAll = useCallback(() => setSelectedRows([]), []);
    useChange(() => {
        onChange && onChange(selectedRows);
    }, [selectedRows]);
    return {
        selectedRows,
        gridProps: {
            selectedRows,
            onSelectedRows: (rowIds: string[]) => setSelectedRows(rowIds),
        },
        deselectAll,
        setSelectedRows,
    } as const;
}

export default useGridSelection;
