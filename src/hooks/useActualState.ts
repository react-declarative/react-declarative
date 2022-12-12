import { useState, useRef, useCallback } from "react";

export const useActualState = <S = undefined>(initialState?: S | (() => S)) => {

    const [state, setState] = useState<S>(initialState!);

    const stateRef = useRef(state);

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
