import { useRef, useCallback } from "react";

import useSingleton from "./useSingleton";

export const useActualRef = <S = undefined>(initialState?: S | (() => S)) => {
  const defaultValue = useSingleton(initialState);
  const stateRef = useRef<S>(defaultValue!);

  const handleState = useCallback((dispatch: S | ((prevState: S) => S)) => {
    let newState: S;
    if (typeof dispatch === "function") {
      newState = (dispatch as Function)(stateRef.current);
    } else {
      newState = dispatch;
    }
    stateRef.current = newState;
  }, []);

  return [stateRef, handleState] as const;
};

export default useActualRef;
