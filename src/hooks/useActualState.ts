import { useState, useRef, useCallback } from "react";

/**
 * Returns an array of values representing the current state and a function to update the state.
 *
 * @template S - The type of the state.
 * @param [initialState] - Optional initial state.
 * @returns - An array containing the mutable reference to the state and the state update function
 *.
 */
export const useActualState = <S = undefined>(initialState?: S | (() => S)) => {

    const [state, setState] = useState<S>(initialState!);

    const stateRef = useRef(state);

    /**
     * Updates the state using the provided dispatch function or value.
     *
     * @param dispatch - The dispatch function which receives the current state and returns a new state, or a new state value directly.
     */
    const handleState: typeof setState = useCallback((dispatch) => {
        let newState: S;
        if (typeof dispatch === 'function') {
            newState = (dispatch as Function)(stateRef.current);
        } else {
            newState = dispatch;
        }
        stateRef.current = newState;
        setState(newState);
    }, []);

    return  [
        stateRef,
        handleState,
    ] as const;
};

export default useActualState;
