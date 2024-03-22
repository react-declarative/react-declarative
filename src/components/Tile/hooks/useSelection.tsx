import React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

import ITileProps from '../model/ITileProps';

const SelectionContext = createContext<IState>(null as never);

export const useSelection = () => useContext(SelectionContext);

/**
 * Interface representing the props for the ISelectionProvider component.
 */
interface ISelectionProviderProps {
    selectedRows: ITileProps['selectedRows'];
    onSelectedRows: ITileProps['onSelectedRows'];
    children: React.ReactNode;
}

/**
 * @interface
 * Represents the state of a selection.
 */
interface IState {
    selection: Set<string>;
    setSelection: (s: Set<string>) => void;
}

/**
 * Compares two sets to check if they are similar.
 *
 * @param s1 - The first set to compare.
 * @param s2 - The second set to compare.
 * @returns Returns true if the two sets are similar, otherwise false.
 */
const compareSelection = (s1: Set<string>, s2: Set<string>) => {
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
 * A component that provides selection functionality for its children.
 * @typedef {Object} ISelectionProviderProps
 * @property {React.ReactNode} children - The child components to wrap with selection functionality.
 * @property {string[]} selectedRows - The currently selected rows.
 * @property {function} onSelectedRows - Callback function to handle selection changes.
 */
export const SelectionProvider = ({
    children,
    selectedRows,
    onSelectedRows,
}: ISelectionProviderProps) => {

    const [selection, setSelection] = useState(new Set<string>(selectedRows));

    /**
     * Handles the change in selection.
     *
     * @param selection - The new selection.
     * @param [initialChange=false] - Indicates whether it is an initial change.
     */
    const handleSelectionChange = (selection: IState['selection'], initialChange = false) => {
        onSelectedRows && onSelectedRows([...selection], initialChange);
        setSelection(new Set(selection));
    };

    /**
     * Represents a variable value.
     *
     * @typedef {Object} VariableValue
     * @property {*} selection - The current selection value.
     * @property {Function} setSelection - The function to handle selection changes.
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
