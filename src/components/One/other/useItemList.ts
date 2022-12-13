import { useState, useLayoutEffect, useRef } from "react";
import { useOneProps } from "../context/PropsProvider";

import IField from "../../../model/IField";
import { useOneState } from "../context/StateProvider";

const LOAD_SOURCE = 'items-field';

interface IParams {
  itemList: IField<any>['itemList'];
  tr: IField<any>['tr'];
  payload: Record<string, any>;
  object: Record<string, any>;
  defaultList?: string[];
}

interface IItemsState {
  items: string[];
  labels: Record<string, string>;
}

interface ILoadingState {
  loading: boolean;
  loaded: boolean;
}

interface IState extends IItemsState, ILoadingState {
}

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
