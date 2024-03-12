import { useEffect, useState } from "react";

import useSubject from "./useSubject";
import useChange from "./useChange";

/**
 * Watches for changes in dependencies and provides a subject to track changes.
 *
 * @param {any[]} deps - The dependencies to watch for changes.
 * @returns {Object} An object containing methods and properties for watching changes.
 */
export const useWatchChanges = (deps: any[] = []) => {
  const changeSubject = useSubject<void>();

  const watch = useChange(() => {
    changeSubject.next();
  }, deps);

  return {
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
