import * as React from 'react';
import { createContext, useContext, useMemo, useState, useEffect, useCallback } from 'react';

import deepFlat from '../../utils/deepFlat';
import getNamespaces from '../../utils/getNamespaces';
import removeDuplicates from '../../utils/removeDuplicates';
import replaceString from '../../utils/replaceString';

import IData from '../../model/IData';

import isObject from '../../../../utils/isObject';
import create from '../../../../utils/create';
import get from '../../../../utils/get';
import set from '../../../../utils/set';
import keyToTitle from '../../utils/keyToTitle';
import countDots from '../../utils/countDots';

import useActualCallback from '../../../../hooks/useActualCallback';
import useActualValue from '../../../../hooks/useActualValue';

import IRecordViewProps from '../../model/IRecordViewProps';

const SearchContext = createContext<Context>(null as never);

/**
 * Represents a context object.
 * @interface
 */
export interface Context {
  data: IData;
  search: string;
  setSearch: (search: string) => void;
  isChecked: (path: string) => boolean;
  setIsChecked: (path: string, checked: boolean) => void;
}

/**
 * Represents the state of the application.
 *
 * @interface State
 */
export interface State {
  search: string;
  data: IData;
  checked: Set<string>;
}

/**
 * Props interface for the component.
 *
 * @typedef Props
 * @property data - The data object used by the component.
 * @property search - The search keyword used by the component.
 * @property withExpandAll - Indicates whether to display the expand all button.
 * @property withExpandRoot - Indicates whether to display the expand root button.
 * @property withExpandLevel - The expand level used by the component.
 * @property [expandList] - The list of items to expand.
 * @property children - The child components passed to the component.
 * @property [onSearchChanged] - The callback function triggered when the search keyword changes.
 */
export interface Props {
  data: IData;
  search: string;
  withExpandAll: boolean;
  withExpandRoot: boolean;
  withExpandLevel: number;
  expandList?: string[];
  formatSearch?: IRecordViewProps['formatSearch'];
  children: React.ReactNode;
  onSearchChanged?: (search: string) => void;
}

/**
 * Represents a Hook object.
 *
 * @interface
 * @extends Context
 */
export interface Hook extends Omit<Context, keyof {
  checked: never;
}> {
  isSearching: boolean;
}

/**
 * SearchProvider is a component that provides search functionality for a data set.
 *
 * @typedef Props - The props for the SearchProvider component.
 * @property children - The children nodes of the SearchProvider component.
 * @property search - The initial search query. Default value is an empty string.
 * @property withExpandAll - Flag to indicate if all namespaces should be expanded. Default value is false.
 * @property withExpandRoot - Flag to indicate if root namespaces should be expanded. Default value is false.
 * @property withExpandLevel - The maximum level of namespaces to expand. Default value is 0.
 * @property expandList - The list of specific namespaces to expand.
 * @property data - The data set to be searched.
 * @property onSearchChanged - The callback function to be called when the search query changes.
 */
export const SearchProvider = ({
  children,
  search: initialSearch = '',
  withExpandAll = false,
  withExpandRoot = false,
  withExpandLevel = 0,
  expandList,
  data: upperData,
  onSearchChanged = () => undefined,
  formatSearch = () => "",
}: Props) => {

  const onSearchChanged$ = useActualCallback(onSearchChanged);

  /**
   * Returns an array of all namespace paths in the upperData object.
   * Namespace paths are derived from the paths of all objects in the upperData object.
   *
   * @returns - An array of namespace paths.
   *
   */
  const getExpandAllNamespaces = useCallback(
    () =>
      deepFlat(upperData)
        .map(({ path }) =>
          path.startsWith("root.") ? path.slice(5) : path
        )
        .filter((path) => path !== "root")
        .filter((path) => {
          const value = get(upperData, path);
          return isObject(value);
        }),
    [upperData]
  );

  /**
   * Retrieves a list of root namespaces from a given data object.
   *
   * @returns - An array of root namespace names.
   */
  const getExpandRootNamespaces = useCallback(
    () =>
      deepFlat(upperData)
        .map(({ path }) =>
          path.startsWith('root.') ? path.replace('root.', '') : path,
        )
        .filter((path) => path !== "root")
        .filter((path) => {
          const value = get(upperData, path);
          let isOk = true;
          isOk = isOk && isObject(value);
          isOk = isOk && !path.includes('.');
          return isOk;
        }),
    [upperData],
  );

  /**
   * Returns an array of namespaces to be expanded based on the given data structure and expand level.
   *
   * @returns An array of namespaces.
   */
  const getExpandLevelNamespaces = useCallback(
    () =>
      deepFlat(upperData)
        .map(({ path }) =>
          path.startsWith('root.') ? path.replace('root.', '') : path,
        )
        .filter((path) => path !== "root")
        .filter((path) => {
          const value = get(upperData, path);
          let isOk = true;
          isOk = isOk && isObject(value);
          isOk = isOk && countDots(path) <= withExpandLevel;
          return isOk;
        }),
    [upperData, withExpandLevel],
  );

  /**
   * Returns the initial expand value for a given configuration.
   *
   * @returns The initial expand value.
   */
  const getInitialExpand = useCallback(() => {
    if (withExpandAll) {
      return getExpandAllNamespaces();
    }
    if (withExpandRoot) {
      return getExpandRootNamespaces();
    }
    if (withExpandLevel) {
      return getExpandLevelNamespaces();
    }
    if (expandList) {
      return expandList.map((path) =>
        path.startsWith('root.') ? path.replace('root.', '') : path,
      );
    }
    return [];
  }, [
    withExpandAll,
    withExpandRoot,
    withExpandLevel,
    getExpandAllNamespaces,
    getExpandRootNamespaces,
    getExpandLevelNamespaces,
    expandList,
  ]);

  const [state, setState] = useState<State>(() => ({
    checked: new Set(getInitialExpand()),
    data: upperData,
    search: initialSearch,
  }));

  const state$ = useActualValue(state);

  useEffect(() => {
    if (!state$.current.search && expandList) {
      setState((prevState) => ({
        ...prevState,
        checked: new Set(getInitialExpand()),
      }));
    }
  }, [expandList]);

  useEffect(() => {
    const data: IData = {};
    const rawNamespaces = deepFlat(upperData)
      .map(({ value, path, name, }) => ({
        path: path.startsWith('root.') ? path.replace('root.', '') : path,
        pathOriginal: path,
        value,
        name,
      }))
      .filter(({ value, path, pathOriginal, name }) => {
        const search = state.search.toLowerCase();
        let isOk = false;
        isOk = isOk || value.toLowerCase().includes(search);
        isOk = isOk || path.toLowerCase().includes(search);
        isOk = isOk || formatSearch(name, value, pathOriginal).toLowerCase().includes(search);
        isOk = isOk || keyToTitle(replaceString(path, '.', ' ')).toLowerCase().includes(search);
        return isOk;
      })
      .flatMap(({ path }) => getNamespaces(path));
    const namespaces = removeDuplicates(rawNamespaces).filter(
      (path) => path !== "root"
    );
    namespaces.forEach((path) => {
      const value = get(upperData, path);
      if (!isObject(value)) {
        create(data, path);
        set(data, path, value);
      }
    });
    setState((prevState) => ({ ...prevState, data }));
  }, [state.search, upperData]);

  useEffect(() => {
    onSearchChanged$(state.search);
  }, [state.search, onSearchChanged$]);

  /**
   * setSearch is a callback function that updates the search state of a component.
   *
   * @param search - The search string to update the state with.
   * @returns
   */
  const setSearch = useCallback(
    (search: string) => setState((prevState) => ({ ...prevState, search })),
    []
  );

  /**
   * A custom callback function that checks if a given path is present in the `state.checked` set.
   *
   * @param path - The path to check.
   * @returns - Returns `true` if the path is present in the `state.checked` set, otherwise `false`.
   */
  const isChecked = useCallback(
    (path: string) => {
      const normalPath = path.startsWith('root.')
        ? path.replace('root.', '')
        : path;
      return state.checked.has(normalPath);
    },
    [state.checked]
  );

  /**
   * Updates the checked state of a specific path.
   *
   * @param path - The path to update the checked state for.
   * @param checked - The new checked value for the path.
   */
  const setIsChecked = useCallback(
    (path: string, checked: boolean) => {
      const normalPath = path.startsWith('root.')
        ? path.replace('root.', '')
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
    [state.checked]
  );

  /**
   * Returns a memoized context object constructed from the given parameters.
   *
   * @returns The memoized context object.
   *
   * @param state - The state object.
   * @param state.data - The data property of the state.
   * @param state.search - The search property of the state.
   * @param setSearch - The setSearch function.
   * @param isChecked - The isChecked property.
   * @param setIsChecked - The setIsChecked function.
   */
  const context = useMemo(
    (): Context => ({
      data: state.data,
      search: state.search,
      setSearch,
      isChecked,
      setIsChecked,
    }),
    [state, isChecked, setSearch, setIsChecked]
  );

  return (
    <SearchContext.Provider value={context}>
      {children}
    </SearchContext.Provider>
  );
};

/**
 * Returns a hook that retrieves search information from the SearchContext.
 *
 * @returns The hook that provides search information.
 */
export const useSearch = (): Hook => {
  const { search, ...other } = useContext(SearchContext);
  return {
    isSearching: !!search,
    search,
    ...other,
  };
};

export default useSearch;
