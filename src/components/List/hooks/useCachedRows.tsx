import React from 'react';
import { createContext } from 'react';
import { useEffect, useContext, useState, useMemo } from 'react';

import IAnything from '../../../model/IAnything';
import IRowData, { RowId } from '../../../model/IRowData';

import useProps from "./useProps";
import useSelection from "./useSelection";

const CachedRowsContext = createContext<IState>(null as never);

export const useCachedRows = <RowData extends IRowData = IAnything>() => useContext(CachedRowsContext) as IState<RowData>;

interface ICachedRowsProviderProps {
    children: React.ReactNode;
}

interface IState<RowData extends IRowData = IAnything> {
    cachedRows: Map<RowId, RowData>;
    selectedRows: RowData[];
}

export const CachedRowsProvider = <RowData extends IRowData = IAnything>({
    children,
}: ICachedRowsProviderProps) => {
    
    const [cachedRows, setCachedRows] = useState(new Map<RowId, RowData>());

    const {
        rows,
    } = useProps();

    const {
        selection,
    } = useSelection();

    useEffect(() => {

        if (selection.size) {
            for (const id of selection) {
                const row = rows.find((row) => row.id === id);
                if (row) {
                    cachedRows.set(id, row);
                }
            }
            for (const id of cachedRows.keys()) {
                if (!selection.has(id)) {
                    cachedRows.delete(id);
                }
            }
            setCachedRows(new Map(cachedRows));
        } else {
            setCachedRows(new Map());
        }

    }, [selection, rows]);

    const selectedRows = useMemo(() => [...selection].map((id) => cachedRows.get(id)), [cachedRows])

    const value = {
        cachedRows,
        selectedRows,
    };

    return (
        <CachedRowsContext.Provider value={value}>
            {children}
        </CachedRowsContext.Provider>
    );
};

export default useCachedRows;
