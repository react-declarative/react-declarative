import { useState, useLayoutEffect, useRef } from "react";

import IField from "../../../model/IField";

interface IParams {
  itemList: IField<any>['itemList'];
  tr: IField<any>['tr'];
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
}: Partial<IParams>): Promise<IItemsState> => {
  const labels: Record<string, string> = {};
  const items = Object.values(typeof itemList === 'function' ? await Promise.resolve(itemList()) : itemList);
  await Promise.all(items.map(async (item) => labels[item] = await Promise.resolve(tr(item))));
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

  const [state, setState] = useState<IState>({
    items: defaultList,
    labels: {},
    loaded: false,
    loading: false,
  });

  useLayoutEffect(() => {
    if (state.loading && !state.loaded) {
      (async () => {
        try {
          const newState = await fetchState({
            itemList,
            tr,
          });
          if (mountedRef.current) {
            setState({
              ...newState,
              loaded: true,
              loading: false,
            });
          }
        } catch (e) {
          console.warn(e);
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
