import React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

import useGridProps from './useGridProps';
import useChangeDelay from '../../../hooks/useChangeDelay';

const SelectionContext = createContext<IState>(null as never);

export const useSelection = () => useContext(SelectionContext);

/**
 * Represents the props for the SelectionProvider component.
 */
interface ISelectionProviderProps {
    children: React.ReactNode;
}

/**
 * Represents the interface for a state object.
 *
 * @interface
 */
interface IState {
    selection: Set<string>;
    setSelection: (s: Set<string>) => void;
}

/**
 * Compares two sets of strings and determines if they are similar.
 *
 * @param s1 - The first set of strings to compare.
 * @param s2 - The second set of strings to compare.
 * @returns Returns true if the sets are similar, false otherwise.
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
 * A provider component that manages the selection state of rows in a grid.
 *
 * @typedef ISelectionProviderProps
 * @property children - The components wrapped by the provider.
 */
export const SelectionProvider = ({
    children,
}: ISelectionProviderProps) => {
    const { selectedRows, onSelectedRows } = useGridProps();

    const [selection, setSelection] = useState(new Set<string>(selectedRows));

    const { delay$, doDelay } = useChangeDelay();

    /**
     * Handles the change in selection.
     *
     * @param selection - The new selection.
     * @param initialChange - Whether the change is initial.
     */
    const handleSelectionChange = (selection: IState['selection'], initialChange = false) => {
        doDelay();
        onSelectedRows && onSelectedRows([...selection], initialChange);
        setSelection(new Set(selection));
    };

    /**
     * Represents a variable value that consists of a selection and a function to set the selection.
     *
     * @type {Object}
     * @property selection - The current selection value.
     * @property setSelection - A function to handle the change of selection value.
     */
    const value = {
        selection,
        setSelection: handleSelectionChange,
    };

    useEffect(() => {
        if (!selectedRows) {
            return;
        }
        if (delay$.current) {
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
