import { useState, useRef, useEffect } from "react";

export const useActualState = <S = undefined>(initialState?: S | (() => S)) => {

    const [state, setState] = useState<S>(initialState!);

    const stateRef = useRef(state);

    useEffect(() => {
        stateRef.current = state;
    }, [state])

    return  {
        state: stateRef.current,
        setState,
    };
};

export default useActualState;
