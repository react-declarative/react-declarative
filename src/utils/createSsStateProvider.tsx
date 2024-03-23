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
  /**
   * WrappedStateProvider is a higher-order component that wraps the StateProvider component.
   * It provides a convenient way to manage state using the StateProvider component with additional functionality.
   *
   * @param props - The properties for WrappedStateProvider.
   * @param props.children - The child components to be rendered.
   * @param props.initialState - The initial state value or a function that returns the initial state value.
   * @param props.onChange - An optional callback function to be called when the state changes. Receives the new state as a parameter.
   *
   * @returns - The rendered child components wrapped with the StateProvider component.
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

export default createSsStateProvider;

