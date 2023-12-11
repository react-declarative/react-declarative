import { useEffect, useState } from "react";

import useSubject from "./useSubject";
import useChange from "./useChange";

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
  };
};

export default useWatchChanges;
