import React from 'react';

import { createContext, useContext, useMemo } from "react";

export const createProvider = <C extends any, P extends any = never>(createPayload: (payload: P) => C) => {

  const Context = createContext<C>(null as never);

  const Provider = ({
    children,
    payload,
  }: {
    children: React.ReactNode;
    payload?: P;
  }) => {
    const value = useMemo(() => createPayload(payload!), [payload]);
    return (
      <Context.Provider value={value}>
        {children}
      </Context.Provider>
    );
  };

  const usePayload = () => useContext(Context);

  return [Provider, usePayload] as const;
};

export const createStatelessProvider = <P extends any>() => createProvider<P, P>((payload) => payload) as [
  React.ComponentType<{
    children: React.ReactNode;
    payload: P;
  }>,
  () => P,
];

export default createProvider;
