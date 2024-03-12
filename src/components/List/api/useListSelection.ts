import { useCallback, useState } from "react";
import { RowId } from "../../../model/IRowData";

/**
 * A custom hook that manages the selection of rows in a list.
 *
 * @returns - An object containing the selected rows, list props, and a function to deselect all rows.
 */
export const useListSelection = () => {
    const [selectedRows, setSelectedRows] = useState<RowId[]>([]);
    const deselectAll = useCallback(() => setSelectedRows([]), []);
    return {
        selectedRows,
        listProps: {
            selectedRows,
            onSelectedRows: (rowIds: RowId[]) => setSelectedRows(rowIds),
        },
        deselectAll,
    } as const;
}

export default useListSelection;
