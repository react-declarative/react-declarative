import { useCallback } from "react";

import useSinglerunAction from "./useSinglerunAction";
import useActualCallback from "./useActualCallback";
import useActualState from "./useActualState";

import getErrorMessage from "../utils/getErrorMessage";
import sleep from "../utils/sleep";

import IAnything from "../model/IAnything";

interface IParams<Data extends IAnything, Result = void> {
  delay?: number;
  onBegin?: () => void;
  onEnd?: (isOk: boolean) => void;
  onFinish?: (
    data: Data[],
    errors: IError[],
    result: (Result | null)[]
  ) => void;
  onError?: (errors: IError[]) => void;
  onProgress?: (progress: number) => void;
  onLoadStart?: () => void;
  onLoadEnd?: (isOk: boolean) => void;
}

interface IError {
  label: string;
  message: string;
  error: Error;
}

interface IState {
  errors: IError[];
  progress: number;
}

interface IProcess<Data extends IAnything> {
  label: string;
  data: Data;
}

const getPercent = (value: number, total: number) =>
  Math.min(100, Math.round((Math.max(value, 0) / total) * 100));

export const useAsyncProgress = <
  Data extends IAnything = IAnything,
  Result = void
>(
  process: (item: IProcess<Data>) => Result | Promise<Result>,
  {
    delay = 0,
    onError = () => undefined,
    onProgress = () => undefined,
    onFinish = () => undefined,
    onBegin = () => undefined,
    onEnd = () => undefined,
    ...otherParams
  }: IParams<Data, Result>
) => {
  const [state$, setState] = useActualState<IState>(() => ({
    errors: [],
    progress: 0,
  }));

  const onError$ = useActualCallback(onError);
  const onFinish$ = useActualCallback(onFinish);
  const onProgress$ = useActualCallback(onProgress);
  
  const onEnd$ = useActualCallback(onEnd);
  const onBegin$ = useActualCallback(onBegin);

  const setProgress = useCallback(
    (progress: number) =>
      setState((prevState) => ({
        ...prevState,
        progress,
      })),
    []
  );

  const setErrors = useCallback(
    (errors: IError[]) =>
      setState((prevState) => ({
        ...prevState,
        errors,
      })),
    []
  );

  const handleError = useCallback(
    (error: IError) =>
      setState((prevState) => ({
        ...prevState,
        errors: [...prevState.errors, error],
      })),
    []
  );

  const { execute, loading } = useSinglerunAction(async (items: IProcess<Data>[]) => {
    onBegin$();
    setProgress(0);
    setErrors([]);
    let count = 0;
    let isOk = true;
    const result: (Result | null)[] = [];
    for (const { label, data } of items) {
      try {
        result.push(
          await process({
            label,
            data,
          })
        );
        await sleep(delay);
      } catch (error) {
        isOk = false;
        result.push(null);
        const e = {
          label,
          message: getErrorMessage(error),
          error: error as unknown as Error,
        };
        handleError(e);
        onError$([...state$.current.errors, e]);
      } finally {
        const progress = getPercent(++count, items.length); 
        setProgress(progress);
        onProgress$(progress)
      }
    }
    onFinish$(
      items.map(({ data }) => data),
      state$.current.errors,
      result
    );
    onEnd$(isOk);
  }, {
    ...otherParams,
    throwError: true,
  });

  return {
    execute: useCallback((items: IProcess<Data>[]) => {
      execute(items);
    }, []),
    loading,
    ...state$.current,
  } as const;
};

export default useAsyncProgress;
