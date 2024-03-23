import * as React from 'react';

import createStateProvider from "./createStateProvider";
import createLsManager from './createLsManager';

/**
 * Creates a state provider that persists state in local storage using a given storage key.
 *
 * @template S The type of the state.
 * @param storageKey The key used to store the state value in local storage.
 * @returns A tuple containing the wrapped state provider
 * component and the state hook.
 */
export const createLsStateProvider = <S extends unknown>(
  storageKey: string
) => {
  const storageManager = createLsManager<S>(storageKey);
  const [StateProvider, useStateProvider] = createStateProvider<S>();
  /**
   * A higher-order component that wraps the StateProvider component and provides additional functionality.
   *
   * @param options - The options for the WrappedStateProvider.
   * @param options.onChange - Optional. A callback function that will be called when the state changes.
   * @param options.children - The child components to be wrapped.
   * @param options.initialState - The initial state value or a function that returns the initial state.
   *
   * @returns - The wrapped components.
   */
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

export default createLsStateProvider;

