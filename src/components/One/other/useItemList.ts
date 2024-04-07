import { useState, useLayoutEffect, useRef } from "react";
import { useOneProps } from "../context/PropsProvider";

import IField from "../../../model/IField";
import { useOneState } from "../context/StateProvider";

const LOAD_SOURCE = 'items-field';

/**
 * Represents the parameters for a certain operation.
 * @interface
 */
interface IParams {
  itemList: IField<any>['itemList'];
  tr: IField<any>['tr'];
  payload: Record<string, any>;
  object: Record<string, any>;
  defaultList?: string[];
}

/**
 * Represents the state of items and labels.
 * @interface
 */
interface IItemsState {
  items: string[];
  labels: Record<string, string>;
}

/**
 * Represents the interface for a loading state.
 *
 * @interface ILoadingState
 * @property loading - Indicates if the state is currently loading.
 * @property loaded - Indicates if the state has finished loading.
 */
interface ILoadingState {
  loading: boolean;
  loaded: boolean;
}

/**
 * Represents the state of an application.
 *
 * @interface
 * @extends {IItemsState}
 * @extends {ILoadingState}
 */
interface IState extends IItemsState, ILoadingState {
}

/**
 * Fetches the state of items asynchronously.
 *
 * @param params - The parameters for fetching the state.
 * @param params.itemList - The list of items to fetch the state for.
 * @param [params.tr] - The translation function for converting item labels.
 * @param [params.payload] - The payload object to be used in the translation function.
 * @param [params.object] - The object to be used in the translation function.
 *
 * @returns The state of the fetched items.
 */
const fetchState = async ({
  itemList = [],
  tr = v => v,
  payload = {},
  object = {},
}: Partial<IParams>): Promise<IItemsState> => {
  const labels: Record<string, string> = {};
  const items = Object.values(typeof itemList === 'function' ? await Promise.resolve(itemList(object, payload)) : itemList);
  await Promise.all(items.map(async (item) => labels[item] = await Promise.resolve(tr(item, object, payload))));
  return {
    labels,
    items,
  };
};

/**
 * Fetches and manages a list of items based on the given parameters.
 *
 * @param params - The parameters for fetching and managing the items.
 * @param params.itemList - The list of items to fetch and manage.
 * @param params.defaultList - The default list of items.
 * @param params.tr - The translation function for translating item labels.
 *
 * @returns - The state object containing the fetched and managed items.
 */
export const useItemList = ({
  itemList = [],
  defaultList = [],
  tr = v => v,
}: IParams): IState => {

  const mountedRef = useRef(true);

  const {
    loadStart,
    loadEnd,
    fallback,
    payload,
  } = useOneProps();

  const {
    object,
  } = useOneState<any>();

  const [state, setState] = useState<IState>({
    items: defaultList,
    labels: {},
    loaded: false,
    loading: false,
  });

  useLayoutEffect(() => {
    if (state.loading && !state.loaded) {
      (async () => {
        let isOk = true;
        loadStart && loadStart(LOAD_SOURCE);
        try {
          const newState = await fetchState({
            itemList,
            tr,
            object,
            payload,
          });
          if (mountedRef.current) {
            setState({
              ...newState,
              loaded: true,
              loading: false,
            });
          }
        } catch (e) {
          isOk = false;
          if (fallback) {
            fallback(e as Error);
          } else {
            throw e;
          }
        } finally {
          loadEnd && loadEnd(isOk, LOAD_SOURCE);
        }
      })();
    }
  }, [state.loading]);

  useLayoutEffect(() => {
    setState((prev) => ({
      ...prev,
      loading: true,
      loaded: false,
    }));
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return state;
};

export default useItemList;
