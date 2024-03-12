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
 * @returns {[ProviderComponent, useStateProviderFunction]} - A tuple containing the Provider component and the useStateProvider function.
 */
export const createStateProvider = <S extends unknown>() => {
  const Context = createContext<
    readonly [S, (state: S | ((prevState: S) => S)) => void]
  >(null as never);

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
