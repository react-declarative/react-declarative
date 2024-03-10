import { useState, useEffect } from "react";

import useAsyncAction, { IResult } from "./useAsyncAction";

interface IParams {
  fallback?: (e: Error) => void;
  onLoadStart?: () => void;
  onLoadEnd?: (isOk: boolean) => void;
  throwError?: boolean;
  deps?: any[];
}

export const useAsyncValue = <Data extends any = any>(
  run: () => Data | Promise<Data>,
  params: IParams = {}
): [Data | null, IResult<void, void>, (data: Data) => void] => {
  const [result, setResult] = useState<Data | null>(null);

  const action = useAsyncAction(async () => {
    const result = await run();
    setResult(result);
  }, params);

  const { deps = [] } = params;

  useEffect(() => {
    action.execute();
  }, deps);

  return [result, action, setResult];
};

export default useAsyncValue;
