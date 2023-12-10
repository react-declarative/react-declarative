import { useCallback, useEffect, useMemo } from "react";

import useSinglerunAction from "../../../hooks/useSinglerunAction";
import useActualCallback from "../../../hooks/useActualCallback";
import useQueuedAction from "../../../hooks/useQueuedAction";
import useActualState from "../../../hooks/useActualState";
import useSubject from "../../../hooks/useSubject";

import RowData from "../model/RowData";
import TSubject from "../../../model/TSubject";

const DEFAULT_LIMIT = 25;

interface IParams<Data = RowData> {
  reloadSubject?: TSubject<void>;
  initialData?: Data[];
  handler: (
    cursor: string | null,
    initial: boolean,
    limit: number
  ) => Data[] | Promise<Data[]>;
  limit?: number;
  onLoadStart?: () => void;
  onLoadEnd?: (isOk: boolean) => void;
  fallback?: (error: Error) => void;
  throwError?: boolean;
}

interface IState<Data = RowData> {
  data: Data[];
  hasMore: boolean;
}

export const useCursorPaginator = <Data extends RowData = RowData>({
  reloadSubject: upperReloadSubject,
  initialData: upperInitialData = [],
  handler,
  limit = DEFAULT_LIMIT,
  ...queryProps
}: IParams<Data>) => {
  const reloadSubject = useSubject(upperReloadSubject);

  const [initialData$, setInitialData$] = useActualState(upperInitialData);

  const [state, setState] = useActualState<IState<Data>>(() => ({
    data: initialData$.current,
    hasMore: true,
  }));

  const handler$ = useActualCallback(handler);

  const { execute: fetchData } = useQueuedAction(async (initial: boolean) => {
    const [lastItem = {}] = state.current.data.slice(-1);
    const { id: lastCursor = null } = lastItem as any;
    return await handler$(lastCursor, initial, limit);
  });

  const {
    execute: onSkip,
    loading,
    error,
  } = useSinglerunAction(async (initial: boolean) => {
    fetchData.cancel();
    const nextData = await fetchData(initial);
    if (!nextData) {
      return;
    }
    setState({
      data: [...state.current.data, ...nextData],
      hasMore: nextData.length >= limit,
    });
  }, queryProps);

  useEffect(
    () =>
      reloadSubject.subscribe(() => {
        fetchData.cancel();
        onSkip.clear();
        setInitialData$([]);
        setState({
          data: [],
          hasMore: true,
        });
        onSkip(true);
      }),
    []
  );

  const lastCursor = useMemo(() => {
    const [lastItem = {}] = state.current.data.slice(-1);
    const { id: lastCursor = null } = lastItem as any;
    return lastCursor;
  }, [state.current.data]);

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

  return {
    data: state.current.data,
    setData,
    hasMore: state.current.hasMore,
    lastCursor,
    loading,
    error,
    onSkip,
  };
};

export default useCursorPaginator;
