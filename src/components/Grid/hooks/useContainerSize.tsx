import * as React from 'react';
import { createContext, useContext } from 'react';

import ISize from '../model/ISize';

const ContainerSizeContext = createContext<ISize>(null as never);

export const useContainerSize = () => useContext(ContainerSizeContext);

interface IContainerSizeProviderProps {
  children: React.ReactNode;
  size: ISize;
}

export const ContainerSizeProvider = ({
  children,
  size,
}: IContainerSizeProviderProps) => (
  <ContainerSizeContext.Provider value={size}>
    {children}
  </ContainerSizeContext.Provider>
);

export default useContainerSize;
