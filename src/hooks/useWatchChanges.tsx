import { useEffect, useState } from "react";

import useSubject from "./useSubject";
import useChange from "./useChange";

import TSubject from "../model/TSubject";

/**
 * Watches for changes in dependencies and provides a subject to track changes.
 * An object containing methods and properties for watching changes.
*/
interface IResult {
  useChanges: () => void;
  changeSubject: TSubject<void>;
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
export const useWatchChanges = (deps: any[] = []): IResult => {
  const changeSubject = useSubject<void>();

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
    changeSubject,
    watch,
  } as const;
};

export default useWatchChanges;
