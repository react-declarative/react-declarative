import React from 'react';
import { createContext, useContext, useState } from 'react';

import { IListSortItem, ListHandlerSortModel } from '../../../model/IListProps';

import useActualValue from '../../../hooks/useActualValue';
import useProps from "./useProps";

const SortModelContext = createContext<IState>(null as never);

export const useSortModel = () => useContext(SortModelContext);

interface ISortModelProviderProps {
    children: React.ReactNode;
    sortModel: ListHandlerSortModel;
}

interface IState {
    sortModel: Map<string, IListSortItem>;
    setSortModel: (s: Map<string, IListSortItem>) => void;
}

export const SortModelProvider = ({
    children,
    sortModel: upperSortModel,
}: ISortModelProviderProps) => {
    const { withSingleSort = false } = useProps();

    const [sortModel, setSortModel] = useState(new Map<string, IListSortItem>(upperSortModel.map((sort) => [String(sort.field), sort])));

    const sortModel$ = useActualValue(sortModel);

    const {
        handleSortModel,
    } = useProps();

    const handleSortModelChange = (sortModel: IState['sortModel']) => {
        if (withSingleSort) {
            sortModel$.current.forEach((value, key) => {
                const itemValue = sortModel.get(key);
                let isOk = true;
                if (itemValue) {
                    isOk = isOk && itemValue.field === value.field;
                    isOk = isOk && itemValue.sort === value.sort;
                }
                !isOk && sortModel.delete(key);
            });
        }
        handleSortModel([...sortModel.values()]);
        setSortModel(new Map(sortModel));
    };

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
