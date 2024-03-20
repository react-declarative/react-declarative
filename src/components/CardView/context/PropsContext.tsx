import * as React from 'react';
import { useContext, createContext } from 'react';

import ICardViewProps from '../model/ICardViewProps';
import IItemData from '../model/IItemData';

const PropsContext = createContext<ICardViewProps>(null as never);

/**
 * The IPropsContextProviderProps interface represents the props that should be passed to the PropsContextProvider component.
 * It defines the expected shape of the props object.
 */
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
