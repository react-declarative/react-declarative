import { useState, useRef } from "react";

export const useActualState = <S = undefined>(initialState?: S | (() => S)) => {

    const [state, setState] = useState<S>(initialState!);

    const stateRef = useRef(state);

    const handleState: typeof setState = (dispatch) => {
        setState((prevState) => {
            let newState: S;
            if (typeof dispatch === 'function') {
                newState = (dispatch as Function)(prevState)
            } else {
                newState = dispatch;
            }
            stateRef.current = newState;
            return newState;
        });
    };

    return  [
        stateRef.current,
        handleState,
    ] as const;
};

export default useActualState;
