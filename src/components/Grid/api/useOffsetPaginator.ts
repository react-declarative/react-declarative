import { useCallback, useEffect } from "react";

import useSinglerunAction from "../../../hooks/useSinglerunAction";
import useActualCallback from "../../../hooks/useActualCallback";
import useQueuedAction from "../../../hooks/useQueuedAction";
import useActualState from "../../../hooks/useActualState";
import useSubject from "../../../hooks/useSubject";

import sleep from "../../../utils/sleep";

import TSubject from "../../../model/TSubject";
import RowData from "../model/RowData";

const DEFAULT_LIMIT = 25;
const SCROLL_REQUEST_DELAY = 100;

interface IParams<Data = RowData> {
  reloadSubject?: TSubject<void>;
  initialData?: Data[];
  handler: (
    limit: number,
    offset: number,
    initial: boolean,
    currentRows: Data[]
  ) => Data[] | Promise<Data[]>;
  limit?: number;
  delay?: number;
  onLoadStart?: () => void;
  onLoadEnd?: (isOk: boolean) => void;
  fallback?: (error: Error) => void;
  throwError?: boolean;
}

interface IState<Data = RowData> {
  data: Data[];
  prevOffset: number;
  hasMore: boolean;
}

export const useOffsetPaginator = <Data extends RowData = RowData>({
  reloadSubject: upperReloadSubject,
  initialData: upperInitialData = [],
  handler,
  limit = DEFAULT_LIMIT,
  delay = SCROLL_REQUEST_DELAY,
  ...queryProps
}: IParams<Data>) => {
  const reloadSubject = useSubject(upperReloadSubject);

  const [initialData$, setInitialData$] = useActualState(upperInitialData);

  const [state, setState] = useActualState<IState<Data>>(() => ({
    data: initialData$.current,
    prevOffset: -limit - initialData$.current.length,
    hasMore: true,
  }));

  const handler$ = useActualCallback(handler);

  const { execute: fetchData } = useQueuedAction(async (initial: boolean) => {
    return await handler$(
      limit,
      state.current.prevOffset + limit + initialData$.current.length,
      initial,
      state.current.data
    );
  });

  const {
    execute: onSkip,
    loading,
    error,
  } = useSinglerunAction(async (initial: boolean) => {
    const nextData = await fetchData(initial);
    if (!nextData) {
      return;
    }
    setState({
      prevOffset:
        state.current.prevOffset + limit + initialData$.current.length,
      data: initial ? nextData : [...state.current.data, ...nextData],
      hasMore: nextData.length >= limit,
    });
    await sleep(delay);
  }, queryProps);

  useEffect(
    () =>
      reloadSubject.subscribe(() => {
        setInitialData$([]);
        fetchData.cancel();
        onSkip.clear();
        setState({
          data: [],
          hasMore: true,
          prevOffset: -limit,
        });
        onSkip(true);
      }),
    []
  );

  const setData = useCallback(
    (data: Data[] | ((prevData: Data[]) => Data[])) =>
      setState((prevState) => ({
        ...prevState,
        data:
          typeof data === "function"
            ? (data as Function)(prevState.data)
            : data,
      })),
    []
  );

  const clear = useCallback(() => {
    setInitialData$([]);
    fetchData.cancel();
    onSkip.clear();
    setState({
      data: [],
      hasMore: true,
      prevOffset: -limit,
    });
  }, []);

  return {
    data: state.current.data,
    setData,
    offset: state.current.prevOffset + limit + initialData$.current.length,
    hasMore: state.current.hasMore,
    loading,
    error,
    onSkip,
    reloadSubject,
    clear,
  };
};

export default useOffsetPaginator;
