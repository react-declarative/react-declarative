import * as React from 'react';
import { createContext, useContext } from 'react';

import IGridProps from '../model/IGridProps';

const GridPropsContext = createContext<IGridProps>(null as never);

export const useGridProps = () => useContext(GridPropsContext);

interface IGridPropsProviderProps {
  children: React.ReactNode;
  value: IGridProps;
}

export const GridPropsProvider = ({
  children,
  value,
}: IGridPropsProviderProps) => (
  <GridPropsContext.Provider value={value}>
    {children}
  </GridPropsContext.Provider>
);

export default useGridProps;
