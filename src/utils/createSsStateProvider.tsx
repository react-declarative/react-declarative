import * as React from 'react';

import createSsManager from "./createSsManager";
import createStateProvider from "./createStateProvider";

/**
 * Creates a state provider for React components with support for persistent state storage.
 * @param storageKey - The key used to store the state in the storage manager.
 * @returns - An array containing the WrappedStateProvider and useStateProvider components.
 * @template S - The type of the state object.
 */
export const createSsStateProvider = <S extends unknown>(
  storageKey: string
) => {
  const storageManager = createSsManager<S>(storageKey);
  const [StateProvider, useStateProvider] = createStateProvider<S>();
  const WrappedStateProvider = ({
    children,
    initialState,
    onChange,
  }: {
    onChange?: (state: S) => void;
    children: React.ReactNode;
    initialState: S | (() => S);
  }) => (
    <StateProvider
      initialState={storageManager.getValue() || initialState}
      onChange={(value) => {
        storageManager.setValue(value);
        onChange && onChange(value);
      }}
    >
      {children}
    </StateProvider>
  );
  return [WrappedStateProvider, useStateProvider] as const;
};

export default createSsStateProvider;

