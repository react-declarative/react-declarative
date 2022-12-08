import React from 'react';
import { createContext, useContext, useState, useMemo } from "react";

export const createStateProvider = <S extends any = object>() => {

  const Context = createContext<readonly [S, ((state: S | ((prevState: S) => S)) => void)]>(null as never);

  const Provider = ({
    children,
    initialState,
  }: {
    children: React.ReactNode;
    initialState: S | (() => S);
  }) => {
    const [state, setState] = useState(initialState);
    const value = useMemo(() => [
      state,
      (value: S | ((prevState: S) => S)) => setState(value),
    ] as const, [state]);
    return (
      <Context.Provider value={value}>
        {children}
      </Context.Provider>
    );
  };

  const useStateProvider = () => useContext(Context);

  return [Provider, useStateProvider] as const;
};

export default createStateProvider;
