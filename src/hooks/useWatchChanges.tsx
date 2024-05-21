import { useCallback, useEffect, useState } from "react";

import useActualValue from "./useActualValue";
import useSubject from "./useSubject";
import useChange from "./useChange";

import TSubject from "../model/TSubject";

/**
 * Watches for changes in dependencies and provides a subject to track changes.
 * An object containing methods and properties for watching changes.
*/
interface IResult<T extends any[] = any[]> {
  useChanges: () => void;
  changeSubject: TSubject<void>;
  waitForChanges: () => Promise<T>;
  watch: {
    resetWatcher: () => void;
    beginWatch: () => void;
    stopWatch: () => void;
  };
}

/**
 * Watches for changes in dependencies and provides a subject to track changes.
 *
 * @param deps - The dependencies to watch for changes.
 * @returns An object containing methods and properties for watching changes.
 */
export const useWatchChanges = <T extends any[] = any[]>(deps: T = [] as unknown as T): IResult => {
  const changeSubject = useSubject<void>();

  const deps$ = useActualValue(deps);

  /**
   * Creates a watcher that triggers a function callback when the dependencies change.
   *
   * @param callback - The function to be executed when the dependencies change.
   * @param dependencies - The dependencies to watch for changes.
   * @returns
   */
  const watch = useChange(() => {
    changeSubject.next();
  }, deps);

  const waitForChanges = useCallback(async () => {
    await changeSubject.toPromise();
    return deps$.current;
  }, []);

  return {
    /**
     * Subscribe to the 'changeSubject' and update the state using useState.
     * The state is updated to the opposite value of the current state.
     *
     * This function should be used inside a functional component to automatically update the state when the 'changeSubject' emits a new value.
     *
     * @param changeSubject - The subject to subscribe to for changes.
     * @returns
     *
     */
    useChanges: () => {
      const [, setState] = useState(true);
      useEffect(
        () =>
          changeSubject.subscribe(() => {
            setState((s) => !s);
          }),
        []
      );
    },
    waitForChanges,
    changeSubject,
    watch,
  } as const;
};

export default useWatchChanges;
