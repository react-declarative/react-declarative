import useSelection from "./useSelection";

import IAnything from "../../../model/IAnything";
import IRowData from "../../../model/IRowData";

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
