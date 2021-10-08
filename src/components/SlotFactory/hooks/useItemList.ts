import { useState, useEffect, useRef } from "react";

import IField from "../../../model/IField";

interface IParams {
  itemList: IField<any>['itemList'];
  tr: IField<any>['tr'];
  defaultList?: string[];
}

interface IState {
  items: string[];
  labels: Record<string, string>;
}

interface IResult extends IState {
  loading: boolean;
  loaded: boolean;
}

const fetchState = async ({
  itemList = [],
  tr = v => v,
}: Partial<IParams>): Promise<IState> => {
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
}: IParams): IResult => {

  const initComplete = useRef(false);

  const [state, setState] = useState<IState>({
    items: defaultList,
    labels: {},
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (loading && !initComplete.current) {
      (async () => {
        try {
          const newState = await fetchState({
            itemList,
            tr,
          });
          setState(newState);
          initComplete.current = true;
          setLoading(false);
        } catch (e) {
          console.warn(e);
        }
      })();
    }
  }, [loading]);

  useEffect(() => {
    setLoading(true);
  }, []);

  const { current: loaded } = initComplete;

  return {
    ...state,
    loading,
    loaded,
  };
};

export default useItemList;
