import * as React from 'react';
import { useContext, createContext } from 'react';

import IItemData from '../model/IItemData';

/**
 * Represents the state of the application.
 * @template ItemData - The type of data for each item in the state.
 */
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

/**
 * Represents a context with state and action for manipulating the state.
 * @template ItemData - The type of item data.
 */
interface IContext<ItemData extends IItemData = any>  {
    state: IState<ItemData>;
    action: {
        setSearch: (search: string) => void;
        setIsAllSelected: (isAllSelected: boolean) => void;
        setSelectedIds: (selectedIds: Set<IItemData['id']>) => void;
        setMenuOpened: (menuOpened: boolean) => void;
    };
}

/**
 * Represents a context for managing CalendarView state.
 */
const StateContext = createContext<IContext>(null as never);

/**
 * Interface representing the props for the State Context Provider.
 *
 * @template ItemData - The type of data for the context items.
 */
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
