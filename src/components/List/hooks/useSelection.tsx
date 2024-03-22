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

export interface ISelectionReloadRef {
    reload: (initialChange?: boolean) => void;
}

export const SelectionProvider = ({
    children,
    selectedRows,
}: ISelectionProviderProps) => {

    const [selection, setSelection] = useState(new Set<RowId>(selectedRows));

    const { onSelectedRows } = useProps();

    const handleSelectionChange = (selection: IState['selection'], initialChange = false) => {
        onSelectedRows && onSelectedRows([...selection], initialChange);
        setSelection(new Set(selection));
    };

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
