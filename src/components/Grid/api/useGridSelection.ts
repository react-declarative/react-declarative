import { useCallback, useState } from "react";

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
