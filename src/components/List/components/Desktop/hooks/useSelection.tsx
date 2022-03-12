import React from 'react';
import { createContext, useContext, useState } from 'react';

import { useProps } from "../../PropProvider";

import IRowData from '../../../../../model/IRowData';

const SelectionContext = createContext<IState>(null as never);

export const useSelection = () => useContext(SelectionContext);

interface ISelectionProviderProps {
    children: React.ReactNode;
}

type ID = IRowData['id'];

interface IState {
    selection: Set<ID>;
    setSelection: (s: Set<ID>) => void;
}

export const SelectionProvider = ({
    children,
}: ISelectionProviderProps) => {

    const [selection, setSelection] = useState(new Set<ID>());

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
