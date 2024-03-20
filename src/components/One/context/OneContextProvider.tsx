import * as React from 'react';
import { createContext, useContext } from 'react';

import IOneProps from '../../../model/IOneProps';

export const DEFAULT_VALUE = {};

const OneContext = createContext<IOneProps['context']>(DEFAULT_VALUE);

/**
 * Interface that represents the props for the `OneContextProvider` component.
 */
interface IOneContextProviderProps {
    context: IOneProps['context'];
    children: React.ReactNode;
}

/**
 * OneContextProvider function provides a context to its child components.
 * @param props - The props object containing the following properties:
 * @param props.context - The context value to be provided to child components. Default value is set to DEFAULT_VALUE.
 * @param props.children - The child components to be wrapped by the context provider.
 * @returns - The wrapped child components with the provided context value.
 */
export const OneContextProvider = ({
    context = DEFAULT_VALUE,
    children,
}: IOneContextProviderProps) => (
    <OneContext.Provider value={context}>
        {children}
    </OneContext.Provider>
);

export const useOneContext = () => useContext(OneContext) || DEFAULT_VALUE;

export default OneContextProvider;
