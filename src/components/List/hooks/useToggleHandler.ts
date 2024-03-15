import useSelection from "./useSelection";

import IAnything from "../../../model/IAnything";
import IRowData from "../../../model/IRowData";

/**
 * Toggles the selection of a given row and updates the selection state.
 *
 * @template RowData The type of data in the row.
 * @param row The row data to toggle the selection for.
 * @returns A function that takes an event and toggles the selection for the row.
 */
export const useToggleHandler = <RowData extends IRowData = IAnything>(row: RowData) => {

    const { selection, setSelection } = useSelection();

    return (radio = false) => (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        if (selection.has(row.id)) {
            selection.delete(row.id);
        } else {
            radio && selection.clear();
            selection.add(row.id);
        }
        setSelection(selection);
    };
};

export default useToggleHandler;
