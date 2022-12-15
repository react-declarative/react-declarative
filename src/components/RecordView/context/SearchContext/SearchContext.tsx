import * as React from 'react';
import { createContext, useContext, useMemo, useState, useEffect, useCallback } from 'react';

import deepFlat from '../../utils/deepFlat';
import getNamespaces from '../../utils/getNamespaces';
import removeDuplicates from '../../utils/removeDuplicates';
import replaceString from '../../utils/replaceString';

import IData from '../../model/IData';

import create from '../../../../utils/create';
import get from '../../../../utils/get';
import set from '../../../../utils/set';

const SearchContext = createContext<Context>(null as never);

export interface Context {
  data: IData;
  search: string;
  setSearch: (search: string) => void;
  isChecked: (path: string) => boolean;
  setIsChecked: (path: string, checked: boolean) => void;
}

export interface State {
  search: string;
  data: IData;
  checked: Set<string>;
}

export interface Props {
  data: IData;
  withExpandAll: boolean;
  children: React.ReactNode;
}

export interface Hook extends Omit<Context, keyof {
  checked: never;
}> {
  isSearching: boolean;
}

export const SearchProvider = ({
  children,
  withExpandAll = false,
  data: upperData,
}: Props) => {
  const [state, setState] = useState<State>(() => ({
    checked: new Set(
      withExpandAll
        ? deepFlat(upperData)
            .map(({ path }) => replaceString(path, 'root.', ''))
            .filter((path) => {
              const value = get(upperData, path);
              return typeof value === 'object';
            })
        : [],
    ),
    data: upperData,
    search: '',
  }));

  useEffect(() => {
    const data: IData = {};
    const rawNamespaces = deepFlat(upperData)
      .map(({ value, path }) => ({
        path: replaceString(path, 'root.', ''),
        value,
      }))
      .filter(({ value, path }) => {
        const search = state.search.toLowerCase();
        let isOk = false;
        isOk = isOk || value.toLowerCase().includes(search);
        isOk = isOk || path.toLowerCase().includes(search);
        return isOk;
      })
      .flatMap(({ path }) => getNamespaces(path));
    const namespaces = removeDuplicates(rawNamespaces).filter(
      (path) => path !== 'root',
    );
    namespaces.forEach((path) => {
      const value = get(upperData, path);
      if (typeof value !== 'object') {
        create(data, path);
        set(data, path, value);
      }
    });
    setState((prevState) => ({ ...prevState, data }));
  }, [state.search, upperData]);

  const setSearch = useCallback(
    (search: string) => setState((prevState) => ({ ...prevState, search })),
    [],
  );

  const isChecked = useCallback(
    (path: string) => {
      const normalPath = path.includes('root.')
        ? replaceString(path, 'root.', '')
        : path;
      return state.checked.has(normalPath);
    },
    [state.checked],
  );

  const setIsChecked = useCallback(
    (path: string, checked: boolean) => {
      const normalPath = path.includes('root.')
        ? replaceString(path, 'root.', '')
        : path;
      if (checked) {
        state.checked.add(normalPath);
      } else {
        state.checked.delete(normalPath);
      }
      setState((prevState) => ({
        ...prevState,
        checked: new Set(state.checked),
      }));
    },
    [state.checked],
  );

  const context = useMemo(
    (): Context => ({
      data: state.data,
      search: state.search,
      setSearch,
      isChecked,
      setIsChecked,
    }),
    [state, isChecked, setSearch, setIsChecked],
  );

  return (
    <SearchContext.Provider value={context}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = (): Hook => {
  const { search, ...other } = useContext(SearchContext);
  return {
    isSearching: !!search,
    search,
    ...other,
  };
};

export default useSearch;
