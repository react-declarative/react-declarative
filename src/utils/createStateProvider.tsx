import * as React from 'react';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from 'react';

import useChange from '../hooks/useChange';

/**
 * Creates a state provider with a given state type.
 *
 * @template S - The type of the state
 * @returns - A tuple containing the Provider component and the useStateProvider function.
 */
export const createStateProvider = <S extends unknown>() => {
  const Context = createContext<
    readonly [S, (state: S | ((prevState: S) => S)) => void]
  >(null as never);

  /**
   * Provider component to manage and provide state to its children.
   * @param props - The component props.
   * @param props.children - The children of the Provider.
   * @param props.onChange - Optional function to be called when the state changes.
   * @param props.initialState - The initial state value or a function to generate the initial state.
   */
  const Provider = ({
    children,
    initialState,
    onChange,
  }: {
    onChange?: (state: S) => void;
    children: React.ReactNode;
    initialState: S | (() => S);
  }) => {
    const [state, setState] = useState(initialState);
    useChange(() => {
      onChange && onChange(state);
    }, [state]);
    const setProviderState = useCallback(
      (newValue: S | ((prevState: S) => S)) => setState(newValue),
      [],
    );
    const value = useMemo(
      () => [state, setProviderState] as const,
      [state, setProviderState],
    );
    return <Context.Provider value={value}>{children}</Context.Provider>;
  };

  const useStateProvider = () => useContext(Context);

  return [Provider, useStateProvider] as const;
};

export default createStateProvider;
