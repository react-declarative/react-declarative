import * as React from 'react';
import { createContext, useContext } from 'react';

import IScaffold3Props from '../model/IScaffold3Props';

const PropsContext = createContext<IScaffold3Props>(null as never);

/**
 * Interface representing the props for the PropsContextProvider component.
 */
interface IPropsContextProviderProps {
    value: IScaffold3Props;
    children: React.ReactNode;
}

/**
 * PropsContextProvider Component
 *
 * @component
 *
 * @param props - Component props
 * @param props.value - The value to be provided by the PropsContext
 * @param props.children - The child components to be rendered
 *
 * @returns - The rendered PropsContextProvider component
 */
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
