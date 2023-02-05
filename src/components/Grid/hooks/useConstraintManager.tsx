import * as React from 'react';
import { createContext, useContext } from 'react';

import { ConstraintManager } from '../helpers/createConstraintManager';

const ConstraintManagerContext = createContext<ConstraintManager>(
  null as never,
);

export const useConstraintManager = () => useContext(ConstraintManagerContext);

interface IConstraintManagerProviderProps {
  children: React.ReactNode;
  constraintManager: ConstraintManager;
}

export const ConstraintManagerProvider = ({
  children,
  constraintManager,
}: IConstraintManagerProviderProps) => (
  <ConstraintManagerContext.Provider value={constraintManager}>
    {children}
  </ConstraintManagerContext.Provider>
);

export default useConstraintManager;
