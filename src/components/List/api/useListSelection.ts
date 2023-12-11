import { useState } from "react";
import { RowId } from "../../../model/IRowData";

export const useListSelection = () => {
    const [selectedRows, setSelectedRows] = useState<RowId[]>([]);
    return {
        selectedRows,
        listProps: {
            selectedRows,
            onSelectedRows: (rowIds: RowId[]) => setSelectedRows(rowIds),
        },
    } as const;
}

export default useListSelection;
