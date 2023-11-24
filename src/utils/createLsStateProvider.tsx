import * as React from 'react';

import createStateProvider from "./createStateProvider";
import createLsManager from './createLsManager';

export const createLsStateProvider = <S extends unknown>(
  storageKey: string
) => {
  const storageManager = createLsManager<S>(storageKey);
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

export default createLsStateProvider;

