import React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

import useGridProps from './useGridProps';

const SelectionContext = createContext<IState>(null as never);

export const useSelection = () => useContext(SelectionContext);

interface ISelectionProviderProps {
    children: React.ReactNode;
}

interface IState {
    selection: Set<string>;
    setSelection: (s: Set<string>) => void;
}

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

export const SelectionProvider = ({
    children,
}: ISelectionProviderProps) => {
    const { selectedRows, onSelectedRows } = useGridProps();

    const [selection, setSelection] = useState(new Set<string>(selectedRows));

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
