import * as React from 'react';
import { createContext, useContext } from 'react';

import { ConstraintManager } from '../helpers/createConstraintManager';

const ConstraintManagerContext = createContext<ConstraintManager>(
  null as never,
);

export const useConstraintManager = () => useContext(ConstraintManagerContext);

/**
 * Interface for the props of the ConstraintManagerProvider component.
 *
 * @interface IConstraintManagerProviderProps
 */
interface IConstraintManagerProviderProps {
  children: React.ReactNode;
  constraintManager: ConstraintManager;
}

/**
 * Provides a context for managing constraints.
 *
 * @param props - The component props.
 * @param props.children - The child components.
 * @param props.constraintManager - The constraint manager instance.
 * @returns - The wrapped child components.
 */
export const ConstraintManagerProvider = ({
  children,
  constraintManager,
}: IConstraintManagerProviderProps) => (
  <ConstraintManagerContext.Provider value={constraintManager}>
    {children}
  </ConstraintManagerContext.Provider>
);

export default useConstraintManager;
