import * as React from 'react';
import { useContext, createContext } from 'react';

import ICardViewProps from '../model/ICardViewProps';
import IItemData from '../model/IItemData';

const PropsContext = createContext<ICardViewProps>(null as never);

interface IPropsContextProviderProps<ItemData extends IItemData = any> {
    value: ICardViewProps<ItemData>;
    children: React.ReactNode;
}

export const PropsContextProvider = <ItemData extends IItemData = any>({
    value,
    children,
}: IPropsContextProviderProps<ItemData>) => (
    <PropsContext.Provider value={value}>
        {children}
    </PropsContext.Provider>
);

export const usePropsContext = () => useContext(PropsContext);

export default usePropsContext;
