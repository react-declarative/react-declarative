import React from 'react';
import { createContext, useContext, useState } from 'react';

import { RowId } from '../../../model/IRowData';

const ExpansionContext = createContext<IState>(null as never);

export const useExpansion = () => useContext(ExpansionContext);

interface IExpansionProviderProps {
    children: React.ReactNode;
}

interface IState {
    expansion: Set<RowId>;
    toggleExpansion: (rowId: RowId) => void;
}

export const ExpansionProvider = ({
    children,
}: IExpansionProviderProps) => {

    const [expansion, setExpansion] = useState(new Set<RowId>());

    const toggleExpansion = (rowId: RowId) => setExpansion((expansion) => {
        const expansionCopy = new Set(expansion);
        if (expansionCopy.has(rowId)) {
            expansionCopy.delete(rowId);
        } else {
            expansionCopy.add(rowId);
        }
        return expansionCopy;
    });

    const value = {
        expansion,
        toggleExpansion,
    };

    return (
        <ExpansionContext.Provider value={value}>
            {children}
        </ExpansionContext.Provider>
    );
};

export default useExpansion;
