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

/**
 * Interface representing the parameters for fetching data.
 * @template Data - Type of data
 */
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

/**
 * Represents the state of a component.
 *
 * @template Data The type of data stored in the state. Defaults to `RowData`.
 */
interface IState<Data = RowData> {
  data: Data[];
  hasMore: boolean;
}

/**
 * A function that handles pagination using cursor-based pagination technique.
 *
 * @template Data The type of data in each row.
 * @param params - The input parameters.
 * @param params.reloadSubject - The reload subject used to trigger a reload.
 * @param [params.initialData=[]] - The initial data for the paginator.
 * @param params.handler - The handler function for fetching more data.
 * @param [params.delay=SCROLL_REQUEST_DELAY] - The delay between each scroll request.
 * @param [params.limit=DEFAULT_LIMIT] - The maximum number of rows to fetch at a time.
 * @param queryProps - Additional properties to be passed to the query.
 * @returns - An object containing the paginator data and functions.
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

  /**
   * Asynchronously fetches data from a specified source.
   *
   * @param {string} url - The URL of the data source to retrieve.
   * @param {Object} options - Additional options for the data retrieval.
   * @param {number} options.timeout - The maximum amount of time, in milliseconds, to wait for a response.
   * @param {boolean} options.cache - Indicates whether the retrieved data should be cached for subsequent requests.
   * @param {function} options.success - A callback function to handle successful data retrieval.
   * @param {function} options.error - A callback function to handle any errors that occur during data retrieval.
   * @returns {void}
   */
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

  /**
   * Returns the lastCursor value by memoizing the computation.
   * The lastCursor is extracted from the lastItem in the state's current data array.
   *
   * @returns {any} The value of the lastCursor.
   *
   * @param {Object} state - The current state object.
   * @param {Array} state.current.data - The data array in the current state.
   *
   */
  const lastCursor = useMemo(() => {
    const [lastItem = {}] = state.current.data.slice(-1);
    const { id: lastCursor = null } = lastItem as any;
    return lastCursor;
  }, [state.current.data]);

  /**
   * Sets the data in the component state.
   *
   * @param {Data[] | ((prevData: Data[]) => Data[])} data - The new data to be set or a function that returns the new data based on the previous data.
   * @returns {void}
   */
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
