import * as React from 'react';
import { createContext, useContext } from 'react';

import IGridProps from '../model/IGridProps';

const GridPropsContext = createContext<IGridProps>(null as never);

export const useGridProps = () => useContext(GridPropsContext);

/**
 * Interface representing the props for the IGridPropsProvider component.
 */
interface IGridPropsProviderProps {
  children: React.ReactNode;
  value: IGridProps;
}

/**
 * Provides Grid properties to its children.
 * @param props - The component props.
 * @param props.children - The child components to render.
 * @param props.value - The Grid properties value.
 * @returns - The rendered JSX.
 */
export const GridPropsProvider = ({
  children,
  value,
}: IGridPropsProviderProps) => (
  <GridPropsContext.Provider value={value}>
    {children}
  </GridPropsContext.Provider>
);

export default useGridProps;
