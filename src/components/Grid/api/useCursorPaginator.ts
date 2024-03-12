import { useCallback, useEffect, useMemo } from "react";

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
    cursor: string | null,
    initial: boolean,
    limit: number,
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
  hasMore: boolean;
}

/**
 * A function that handles pagination using cursor-based pagination technique.
 *
 * @template Data The type of data in each row.
 * @param {Object} params - The input parameters.
 * @param {Subject} params.reloadSubject - The reload subject used to trigger a reload.
 * @param {Array} [params.initialData=[]] - The initial data for the paginator.
 * @param {Function} params.handler - The handler function for fetching more data.
 * @param {number} [params.delay=SCROLL_REQUEST_DELAY] - The delay between each scroll request.
 * @param {number} [params.limit=DEFAULT_LIMIT] - The maximum number of rows to fetch at a time.
 * @param {Object} queryProps - Additional properties to be passed to the query.
 * @returns {Object} - An object containing the paginator data and functions.
 */
export const useCursorPaginator = <Data extends RowData = RowData>({
  reloadSubject: upperReloadSubject,
  initialData: upperInitialData = [],
  handler,
  delay = SCROLL_REQUEST_DELAY,
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
    return await handler$(lastCursor, initial, limit, state.current.data);
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
      data: initial ? nextData : [...state.current.data, ...nextData],
      hasMore: nextData.length >= limit,
    });
    await sleep(delay);
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
    reloadSubject,
  };
};

export default useCursorPaginator;
