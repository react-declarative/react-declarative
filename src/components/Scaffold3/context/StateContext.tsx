import * as React from "react";
import {
  useState,
  useLayoutEffect,
  useRef,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { createContext } from "react";

import IScaffold3Group, {
  IScaffold3GroupInternal,
} from "../model/IScaffold3Group";
import IScaffold3Option, {
  IScaffold3OptionInternal,
} from "../model/IScaffold3Option";
import IScaffold3Tab, { IScaffold3TabInternal } from "../model/IScaffold3Tab";
import Payload from "../model/Payload";

import arrays from "../../../utils/arrays";
import objects from "../../../utils/objects";
import deepClone from "../../../utils/deepClone";
import useChange from "../../../hooks/useChange";

import deepFlat, { Entry } from "../utils/deepFlat";
import idToLabel from "../utils/idToLabel";
import getNamespaces from "../utils/getNamespaces";

/**
 * The EntryInternal class represents an entry in the scaffold,
 * which combines functionality from multiple interfaces.
 * It extends the IScaffold3GroupInternal, IScaffold3OptionInternal,
 * IScaffold3Group, and IScaffold3Option interfaces.
 *
 * @implements {IScaffold3GroupInternal}
 * @implements {IScaffold3OptionInternal}
 * @implements {IScaffold3Group}
 * @implements {IScaffold3Option}
 */
type EntryInternal = IScaffold3GroupInternal &
  IScaffold3OptionInternal &
  IScaffold3Group &
  IScaffold3Option;

/**
 * Represents the parameters for a certain class.
 * @interface
 */
interface IParams {
  onInit?: () => void | Promise<void>;
  onLoadStart?: () => void;
  onLoadEnd?: (isOk: boolean) => void;
  fallback?: (e: Error) => void;
  throwError?: boolean;
  options: IScaffold3Group[];
  payload: Payload;
  deps: any[];
}

/**
 * Represents the result of a search operation.
 *
 * @interface IResult
 */
interface IResult {
  loading: boolean;
  filteredGroups: IScaffold3GroupInternal[];
  searchText: string;
  setSearchText: (searchText: string) => void;
  doInit: () => void | Promise<void>;
}

/**
 * Create a state manager with the given parameters
 *
 * @param params - The parameters for creating the state manager
 * @param params.onLoadStart - A callback function called when the loading starts
 * @param params.onLoadEnd - A callback function called when the loading ends
 * @param [params.onInit=() => undefined] - A callback function called during initialization
 * @param [params.fallback] - A fallback function called when an error occurs, if `throwError` is set to `false`
 * @param [params.options] - Additional options for the state manager
 * @param [params.payload] - Additional payload for the state manager
 * @param [params.deps] - Dependencies for the state manager
 * @param [params.throwError=false] - Flag indicating whether to throw an error or call the fallback function when an error occurs
 *
 * @returns - The state manager object with the following properties:
 *    - `loading` (boolean) - Flag indicating whether the state manager is currently loading
 *    - `searchText` (string) - The current search text
 *    - `setSearchText` (Function) - A function to set the search text
 *    - `filteredGroups` (Array) - The filtered groups based on the search text
 *    - `doInit` (Function) - A function to initialize the state manager
 */
export const createStateManager = ({
  onLoadStart,
  onLoadEnd,
  onInit = () => undefined,
  fallback,
  options,
  payload,
  deps,
  throwError = false,
}: IParams): IResult => {
  const [loading, setLoading] = useState(0);
  const [groups, setGroups] = useState<IScaffold3GroupInternal[]>([]);
  const [searchText, setSearchText] = useState("");

  const isMounted = useRef(true);

  useLayoutEffect(
    () => () => {
      isMounted.current = false;
    },
    []
  );

  /**
   * Builds groups and updates the state with the result.
   *
   * @param payload - The payload object to pass to isVisible, isDisabled, and isActive functions.
   * @returns
   */
  const buildGroups = useCallback(
    async (payload: Payload) => {
      const result: Entry[] = arrays(
        deepClone(objects(options))
      );
      const entries = deepFlat(result) as EntryInternal[];
      let isOk = true;
      try {
        onLoadStart && onLoadStart();
        isMounted.current && setLoading((loading) => loading + 1);
        await Promise.all(
          entries.map(async (entry) => {
            if (entry.isVisible) {
              entry.visible = await entry.isVisible(payload);
            } else {
              entry.visible = true;
            }
            if (entry.isDisabled) {
              entry.disabled = await entry.isDisabled(payload);
            } else {
              entry.disabled = false;
            }
            if (entry.tabs) {
              entry.tabs = await Promise.all(
                entry.tabs.map(
                  async (tab: IScaffold3Tab & IScaffold3TabInternal) => {
                    if (tab.isVisible) {
                      tab.visible = await tab.isVisible(payload);
                    } else {
                      tab.visible = true;
                    }
                    if (tab.isDisabled) {
                      tab.disabled = await tab.isDisabled(payload);
                    } else {
                      tab.disabled = false;
                    }
                    if (tab.isActive) {
                      tab.active = await tab.isActive(payload);
                    } else {
                      tab.active = false;
                    }
                    tab.path = `${entry.path}.${tab.id}`;
                    return tab;
                  }
                )
              );
            }
          })
        );
        setGroups(result);
      } catch (e: any) {
        isOk = false;
        if (!throwError) {
          fallback && fallback(e as Error);
        } else {
          throw e;
        }
      } finally {
        onLoadEnd && onLoadEnd(isOk);
        isMounted.current && setLoading((loading) => loading - 1);
      }
    },
    [options, payload, ...deps]
  );

  /**
   * Initializes the component.
   *
   * @function doInit
   * @async
   * @callback
   * @description This function initializes the component by invoking the onLoadStart, setLoading, onInit,
   *              and buildGroups functions sequentially. It also handles error fallback or throwing the error,
   *              and invokes the onLoadEnd function with a boolean flag indicating if the initialization was
   *              successful or not. Finally, it updates the loading status by invoking the setLoading function.
   * @returns
   */
  const doInit = useCallback(async () => {
    let isOk = true;
    try {
      onLoadStart && onLoadStart();
      isMounted.current && setLoading((loading) => loading + 1);
      await onInit();
      await buildGroups(payload);
    } catch (e: any) {
      isOk = false;
      if (!throwError) {
        fallback && fallback(e as Error);
      } else {
        throw e;
      }
    } finally {
      onLoadEnd && onLoadEnd(isOk);
      isMounted.current && setLoading((loading) => loading - 1);
    }
  }, []);

  useChange(() => {
    buildGroups(payload);
  }, [payload, ...deps]);

  /**
   * Holds the filtered groups based on the searchText.
   *
   * @type {IScaffold3GroupInternal[]}
   */
  const filteredGroups = useMemo(() => {
    const result: IScaffold3GroupInternal[] = arrays(deepClone(objects(groups)));
    if (!searchText) {
      return Object.values(result);
    }
    const entries = deepFlat(result);
    const namespaces = new Set<string>(entries
      .filter(({ id, path, label = idToLabel(id) }) => {
        const searchStr = searchText.toLowerCase();
        let isOk = false;
        isOk = isOk || label.toLowerCase().includes(searchStr);
        isOk = isOk || id.toLowerCase().includes(searchStr);
        isOk = isOk || path.toLowerCase().includes(searchStr);
        return isOk;
      })
      .flatMap(({ path }) => getNamespaces(path)));
    entries.forEach((entry) => {
        if (!namespaces.has(entry.path)) {
            entry.visible = false;
        }
    });
    return Object.values(result);
  }, [groups, searchText]);

  return {
    loading: !!loading,
    searchText,
    setSearchText,
    filteredGroups,
    doInit,
  };
};

type StateContextType = ReturnType<typeof createStateManager>;

const StateContext = createContext<StateContextType>(null as never);

/**
 * Represents the properties for the StateContextProvider component.
 */
interface IStateContextProviderProps {
  value: StateContextType;
  children: React.ReactNode;
}

export const StateContextProvider = ({
  children,
  value,
}: IStateContextProviderProps) => (
  <StateContext.Provider value={value}>{children}</StateContext.Provider>
);

export const useStateContext = () => useContext(StateContext);

export default useStateContext;
