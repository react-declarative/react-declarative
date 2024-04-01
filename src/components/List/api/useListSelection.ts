import { useCallback, useState } from "react";
import { RowId } from "../../../model/IRowData";
import useChange from "../../../hooks/useChange";

/**
 * Represents the interface for the params.
 * @interface
 */
interface IParams {
    selectedRows?: RowId[];
    onChange: (selectedRows: RowId[]) => void;
}

/**
 * A custom hook that manages the selection of rows in a list.
 *
 * @returns - An object containing the selected rows, list props, and a function to deselect all rows.
 */
export const useListSelection = ({
    selectedRows: defaultSelectedRows = [],
    onChange,
}: Partial<IParams> = {}) => {
    const [selectedRows, setSelectedRows] = useState<RowId[]>(defaultSelectedRows);
    const deselectAll = useCallback(() => setSelectedRows([]), []);
    useChange(() => {
        onChange && onChange(selectedRows);
    }, [selectedRows]);
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
