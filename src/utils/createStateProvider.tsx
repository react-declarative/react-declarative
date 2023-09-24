import * as React from 'react';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from 'react';

export const createStateProvider = <S extends unknown>() => {
  const Context = createContext<
    readonly [S, (state: S | ((prevState: S) => S)) => void]
  >(null as never);

  const Provider = ({
    children,
    initialState,
  }: {
    children: React.ReactNode;
    initialState: S | (() => S);
  }) => {
    const [state, setState] = useState(initialState);
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
