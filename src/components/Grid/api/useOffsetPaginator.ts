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

/**
 * Represents the parameters required to configure a data handler for fetching and processing data.
 *
 * @template Data - The type of data to be handled.
 */
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

/**
 * @interface
 * Represents the state of a component or system.
 * @template Data - The type of data stored in the state.
 */
interface IState<Data = RowData> {
  data: Data[];
  prevOffset: number;
  hasMore: boolean;
}

/**
 * Implements an offset-based pagination logic for fetching and managing data.
 *
 * @template Data - The type of the data to be paginated, extending RowData.
 *
 * @param params - The parameters for configuring the pagination logic.
 * @param params.reloadSubject - The reload subject used to trigger a data reload.
 * @param params.initialData - The initial data to be displayed.
 * @param params.handler - The function for fetching more data.
 * @param params.limit - The maximum number of items to be fetched per request.
 * @param params.delay - The delay (in milliseconds) between requests.
 * @param queryProps - Additional query properties to be passed to the handler function.
 *
 * @returns - An object containing the paginated data and various utility functions.
 * @returns data - The paginated data.
 * @returns setData - A function to update the paginated data.
 * @returns offset - The offset of the current page.
 * @returns hasMore - A flag indicating if there are more items to load.
 * @returns loading - A flag indicating if a request is currently loading.
 * @returns error - The error object, if an error occurred during the request.
 * @returns onSkip - A function to skip to the next page.
 * @returns reloadSubject - The reload subject used to trigger a data reload.
 * @returns clear - A function to clear the paginated data and reset the pagination state.
 */
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

  /**
   * Function to fetch data from a specific source.
   *
   * @param {string} url - The URL to fetch the data from.
   * @param {Object} options - Additional options to customize the data fetching process.
   * @param {boolean} options.cache - Specify whether to cache the fetched data or not.
   * @param {number} options.timeout - Specify the timeout in milliseconds for the data fetching request.
   * @param {string} options.method - The HTTP method to use for the request, defaults to 'GET'.
   * @param {Object} options.headers - Additional headers to include in the request.
   * @param {function} options.onProgress - Callback function to handle request progress updates.
   * @param {function} options.onError - Callback function to handle request errors.
   * @param {function} options.onSuccess - Callback function to handle successful request completion.
   *
   * @returns {Promise} - A promise that resolves with the fetched data.
   *
   * @throws {Error} - If the URL is not a valid string or if any of the options are of invalid type.
   */
  const { execute: fetchData } = useQueuedAction(async (initial: boolean) => {
    return await handler$(
      limit,
      state.current.prevOffset + limit + initialData$.current.length,
      initial,
      state.current.data
    );
  });

  /**
   * Handler function that is called when a skip event occurs.
   * Skipped events typically occur when there is an error or exception in the execution
   * of a process or workflow, and the execution is intentionally skipped to a specific step.
   *
   * @param {Object} event - The skip event object containing relevant information about the skip.
   * @param {string} event.step - The step that was skipped.
   * @param {string} event.reason - The reason for skipping the step.
   * @param {Object} event.data - Optional data associated with the skip event.
   * @return {void}
   */
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

  /**
   * Sets the data of the component state.
   *
   * @param {Data[] | ((prevData: Data[]) => Data[])} data - The new data to set.
   *   If a function is provided, it receives the previous data as a parameter and should return the updated data.
   *   If an array is provided, it replaces the current data with the new array.
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

  /**
   * Clears the data and sets the initial state.
   */
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
