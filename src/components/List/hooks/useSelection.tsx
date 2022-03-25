import React from 'react';
import { createContext, useContext, useState } from 'react';

import useProps from "./useProps";

import { RowId } from '../../../model/IRowData';

const SelectionContext = createContext<IState>(null as never);

export const useSelection = () => useContext(SelectionContext);

interface ISelectionProviderProps {
    children: React.ReactNode;
}

interface IState {
    selection: Set<RowId>;
    setSelection: (s: Set<RowId>) => void;
}

export const SelectionProvider = ({
    children,
}: ISelectionProviderProps) => {

    const [selection, setSelection] = useState(new Set<RowId>());

    const { onSelectedRows } = useProps();

    const handleSelectionChange = (selection: IState['selection']) => {
        onSelectedRows && onSelectedRows([...selection]);
        setSelection(new Set(selection));
    };

    const value = {
        selection,
        setSelection: handleSelectionChange,
    };

    return (
        <SelectionContext.Provider value={value}>
            {children}
        </SelectionContext.Provider>
    );
};

export default useSelection;
