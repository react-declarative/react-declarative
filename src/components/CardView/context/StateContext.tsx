import * as React from 'react';
import { useContext, createContext } from 'react';

import IItemData from '../model/IItemData';

export interface IState<ItemData extends IItemData = any> {
    items: ItemData[];
    hasMore: boolean;
    loading: boolean;
    search: string;
    skip: number;
    isAllSelected: boolean;
    menuOpened: boolean;
    selectedIds: Set<IItemData['id']>;
}

interface IContext<ItemData extends IItemData = any>  {
    state: IState<ItemData>;
    action: {
        setSearch: (search: string) => void;
        setIsAllSelected: (isAllSelected: boolean) => void;
        setSelectedIds: (selectedIds: Set<IItemData['id']>) => void;
        setMenuOpened: (menuOpened: boolean) => void;
    };
}

const StateContext = createContext<IContext>(null as never);

interface IStateContextProviderProps<ItemData extends IItemData = any>  {
    children: React.ReactNode;
    value: IContext<ItemData>;
}

export const StateContextProvider = <ItemData extends IItemData = any> ({
    children,
    value,
}: IStateContextProviderProps<ItemData>) => (
    <StateContext.Provider value={value}>
        {children}
    </StateContext.Provider>
);

export const useStateContext = <ItemData extends IItemData = any>() => useContext(StateContext) as IContext<ItemData>;

export default useStateContext;
