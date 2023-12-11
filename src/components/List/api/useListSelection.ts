import { useCallback, useState } from "react";
import { RowId } from "../../../model/IRowData";

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
