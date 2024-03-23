import React from 'react';
import { createContext, useContext } from "react";

/**
 * Creates a value provider with a default value.
 * @param defaultValue - The default value for the provider.
 * @returns A tuple containing the provider component and a hook to access the value.
 */
export const createValueProvider = <P extends any = object>(defaultValue?: P) => {

  const Context = createContext<P>(defaultValue || null as never);

  /**
   * Represents a Provider component.
   * @param props - The props for the Provider component.
   * @param props.children - The children components to be wrapped by the Provider.
   * @param props.payload - The payload value to be provided by the Provider.
   * @returns - The wrapped children components with the provided payload.
   */
  const Provider = ({
    children,
    payload,
  }: {
    children: React.ReactNode;
    payload: P;
  }) => (
    <Context.Provider value={payload}>
      {children}
    </Context.Provider>
  );

  const usePayload = () => useContext(Context);

  return [Provider, usePayload] as const;
};

export default createValueProvider;
