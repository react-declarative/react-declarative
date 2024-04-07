import React from 'react';
import { createContext } from 'react';
import { useEffect, useContext, useState, useMemo } from 'react';

import IAnything from '../../../model/IAnything';
import IRowData, { RowId } from '../../../model/IRowData';

import useProps from "./useProps";
import useSelection from "./useSelection";

const CachedRowsContext = createContext<IState>(null as never);

/**
 * Represents the usage of cached rows.
 *
 * @returns The context containing the cached rows.
 *
 * @template RowData The type of the row data. Extends IRowData, defaults to IAnything.
 */
export const useCachedRows = <RowData extends IRowData = IAnything>() => useContext(CachedRowsContext) as IState<RowData>;

/**
 * Represents the props for the `ICachedRowsProvider` component.
 *
 * @interface ICachedRowsProviderProps
 */
interface ICachedRowsProviderProps {
    children: React.ReactNode;
}

/**
 * Represents the state of a particular entity.
 * @interface
 * @template RowData - The type of RowData.
 */
interface IState<RowData extends IRowData = IAnything> {
    cachedRows: Map<RowId, RowData>;
    selectedRows: RowData[];
}

/**
 * A component for caching and providing rows and selected rows.
 *
 * @template RowData - Type parameter for the row data.
 * @param props - The component props.
 * @return - The rendered component.
 */
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

    /**
     * Memoizes and selects rows based on given selection and cached rows.
     *
     * @param selection - The selected row IDs.
     * @param cachedRows - The cached rows with their corresponding IDs.
     * @returns - The selected rows.
     */
    const selectedRows = useMemo(() => [...selection].map((id) => cachedRows.get(id)), [cachedRows])

    /**
     * Represents the value of a variable.
     * @typedef {Object} VariableValue
     * @property cachedRows - The cached rows of data.
     * @property selectedRows - The selected rows of data.
     */
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
