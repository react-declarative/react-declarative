import { useRef, useCallback } from "react";

import useSingleton from "./useSingleton";

/**
 * Custom hook that creates a mutable reference to a state value
 * and a function to update the state value.
 *
 * @template S - The type of the state value
 * @param {S | (() => S)?} initialState - The initial state value or a function that returns the initial state value
 * @returns {[React.MutableRefObject<S>, (dispatch: S | ((prevState: S) => S)) => void]} - An array containing the state reference and handleState function
 */
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
