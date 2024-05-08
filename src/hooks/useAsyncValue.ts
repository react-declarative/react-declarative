import { useState, useEffect, useCallback } from "react";

import useAsyncAction, { IResult } from "./useAsyncAction";
import useActualValue from "./useActualValue";

import sleep from "../utils/sleep";

/**
 * Represents the options for configuring various parameters.
 */
interface IParams {
  fallback?: (e: Error) => void;
  onLoadStart?: () => void;
  onLoadEnd?: (isOk: boolean) => void;
  throwError?: boolean;
  deps?: any[];
}

/**
 * This function allows you to manage an asynchronous value by providing a run function and optional parameters.
 *
 * @template Data - The data type of the async value.
 * @param run - A function that returns the async value or a promise that resolves to the async value.
 * @param [params={}] - Optional parameters for customizing the behavior of the async value.
 * @returns - An array containing the current async value, action object for executing the async action, and a setter function
 * to update the async value.
 */
export const useAsyncValue = <Data extends any = any>(
  run: () => Data | Promise<Data>,
  params: IParams = {}
): [Data | null, IResult<void, void>, (data: Data) => void, { waitForResult: () => Promise<Data> }] => {
  const [result, setResult] = useState<Data | null>(null);
  const result$ = useActualValue(result);

  /**
   * Executes an asynchronous action with parameters.
   *
   * @param action - The asynchronous action to be executed.
   * @param params - The parameters to be passed to the action.
   */
  const action = useAsyncAction(async () => {
    const result = await run();
    setResult(result);
  }, params);

  const { deps = [] } = params;

  useEffect(() => {
    action.execute();
  }, deps);

  const waitForResult = useCallback(async () => {
    while (!result$.current) {
      await sleep(250);
    }
    return result$.current!;
  }, []);

  return [result, action, setResult, { waitForResult }];
};

export default useAsyncValue;
