import React from 'react';
import { createContext, useContext, useState } from 'react';

import { IListSortItem, ListHandlerSortModel } from '../../../model/IListProps';

import useActualValue from '../../../hooks/useActualValue';
import useProps from "./useProps";

const SortModelContext = createContext<IState>(null as never);

export const useSortModel = () => useContext(SortModelContext);

/**
 * Interface for the props of the `ISortModelProvider` component.
 */
interface ISortModelProviderProps {
    children: React.ReactNode;
    sortModel: ListHandlerSortModel;
}

/**
 * Represents the interface for managing the state of a list sorting model.
 */
interface IState {
    sortModel: Map<IListSortItem['field'], IListSortItem>;
    setSortModel: (s: Map<IListSortItem['field'], IListSortItem>) => void;
}

/**
 * Provides sorting functionality for a list component.
 *
 * @typedef {Object} SortModelProvider
 * @property {ReactNode} children - The child components.
 * @property {Array.<Object>} sortModel - The initial sort model.
 */
export const SortModelProvider = ({
    children,
    sortModel: upperSortModel,
}: ISortModelProviderProps) => {
    const { withSingleSort = false } = useProps();

    const [sortModel, setSortModel] = useState(new Map<IListSortItem['field'], IListSortItem>(upperSortModel.map((sort) => [String(sort.field), sort])));

    const sortModel$ = useActualValue(sortModel);

    const {
        handleSortModel,
    } = useProps();

    /**
     * Handles changes in the sort model.
     *
     * @param sortModel - The new sort model.
     */
    const handleSortModelChange = (sortModel: IState['sortModel']) => {
        const { current: upperSortModel } = sortModel$;
        if (withSingleSort) {
            const targetField = [...sortModel.values()]
                .find(({ field, sort }) => {
                    const upperSort = upperSortModel.get(field);
                    if (upperSort) {
                        return upperSort.sort !== sort;
                    }
                    return true;
                });
            sortModel.forEach(({ field }) => {
                if (field !== targetField?.field) {
                    sortModel.delete(field);
                }
            });
        }
        handleSortModel([...sortModel.values()]);
        setSortModel(new Map(sortModel));
    };

    /**
     * Represents the value object.
     * @typedef {Object} VariableValue
     * @property {Array} sortModel - An array containing the sorting model.
     * @property {Function} setSortModel - A function to handle changes to the sorting model.
     */
    const value = {
        sortModel,
        setSortModel: handleSortModelChange,
    };

    return (
        <SortModelContext.Provider value={value}>
            {children}
        </SortModelContext.Provider>
    );
};

export default useSortModel;
