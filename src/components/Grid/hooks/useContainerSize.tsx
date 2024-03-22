import * as React from 'react';
import { createContext, useContext } from 'react';

import ISize from '../model/ISize';

const ContainerSizeContext = createContext<ISize>(null as never);

export const useContainerSize = () => useContext(ContainerSizeContext);

/**
 * Represents the properties for the `ContainerSizeProvider` component.
 */
interface IContainerSizeProviderProps {
  children: React.ReactNode;
  size: ISize;
}

/**
 * ContainerSizeProvider is a component that provides the size prop to its children via a context
 *
 * @param props - The properties passed to ContainerSizeProvider
 * @param props.children - The child elements to be rendered
 * @param props.size - The size value to be provided via context
 *
 * @return The rendered child elements wrapped in a ContainerSizeContext.Provider
 */
export const ContainerSizeProvider = ({
  children,
  size,
}: IContainerSizeProviderProps) => (
  <ContainerSizeContext.Provider value={size}>
    {children}
  </ContainerSizeContext.Provider>
);

export default useContainerSize;
