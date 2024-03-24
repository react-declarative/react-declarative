import React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

import useProps from "./useProps";

import { RowId } from '../../../model/IRowData';

const SelectionContext = createContext<IState>(null as never);

export const useSelection = () => useContext(SelectionContext);

/**
 * Represents the properties for the ISelectionProvider component.
 */
interface ISelectionProviderProps {
    children: React.ReactNode;
    selectedRows?: RowId[];
}

/**
 * Represents the state of a selection.
 * @interface
 */
interface IState {
    selection: Set<RowId>;
    setSelection: (s: Set<RowId>) => void;
}

/**
 * Compares two sets of row ids to determine if they are similar.
 *
 * @param s1 - The first set of row ids.
 * @param s2 - The second set of row ids.
 * @returns - True if the sets are similar, false otherwise.
 */
const compareSelection = (s1: Set<RowId>, s2: Set<RowId>) => {
    if (s1.size !== s2.size) {
        return false;
    } else {
        let isSimilar = true;
        s1.forEach((row) => {
            if (!s2.has(row) && isSimilar) {
                isSimilar = false;
            }
        });
        s2.forEach((row) => {
            if (!s1.has(row) && isSimilar) {
                isSimilar = false;
            }
        });
        return isSimilar;
    }
};

/**
 * Represents a selection reload reference.
 * @interface
 */
export interface ISelectionReloadRef {
    reload: (initialChange?: boolean) => void;
}

/**
 * SelectionProvider component
 *
 * @param props - The properties of the component.
 * @param props.children - The children to be rendered.
 * @param props.selectedRows - The initial selected rows.
 *
 * @returns - The rendered component.
 */
export const SelectionProvider = ({
    children,
    selectedRows,
}: ISelectionProviderProps) => {

    const [selection, setSelection] = useState(new Set<RowId>(selectedRows));

    const { onSelectedRows } = useProps();

    /**
     * Handles the change in selection of the rows.
     *
     * @param selection - The updated selection of rows.
     * @param [initialChange=false] - Flag indicating if the change is initial.
     *
     * @return
     */
    const handleSelectionChange = (selection: IState['selection'], initialChange = false) => {
        onSelectedRows && onSelectedRows([...selection], initialChange);
        setSelection(new Set(selection));
    };

    /**
     * Represents a variable value containing selection and a function to set the selection.
     *
     * @typedef {object} Value
     * @property {any} selection - The selected value.
     * @property {function} setSelection - A function to handle selection changes.
     */
    const value = {
        selection,
        setSelection: handleSelectionChange,
    };

    useEffect(() => {
        if (!selectedRows) {
            return;
        }
        const pendingSelection = new Set(selectedRows);
        if (!compareSelection(pendingSelection, selection)) {
            handleSelectionChange(pendingSelection);
        }
    }, [selectedRows]);

    return (
        <SelectionContext.Provider value={value}>
            {children}
        </SelectionContext.Provider>
    );
};

export default useSelection;
