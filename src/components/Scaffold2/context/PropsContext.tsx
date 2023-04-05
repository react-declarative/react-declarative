import * as React from 'react';
import { createContext, useContext } from 'react';

import IScaffold2Props from '../model/IScaffold2Props';

const PropsContext = createContext<IScaffold2Props>(null as never);

interface IPropsContextProviderProps {
    value: IScaffold2Props;
    children: React.ReactNode;
}

export const PropsContextProvider = ({
    value,
    children,
}: IPropsContextProviderProps) => (
    <PropsContext.Provider value={value}>
        {children}
    </PropsContext.Provider>
);

export const usePropsContext = () => useContext(PropsContext);

export default usePropsContext;
