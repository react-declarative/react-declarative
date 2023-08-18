import { useState, useMemo } from "react";

interface IState {
    disabled: boolean;
    readonly: boolean;
    visible: boolean;
}

interface IInitialData extends Omit<IState, keyof {
    readonly: never;
    visible: never;
}> {}

export const useLayoutState = (initialData: IInitialData) => {

    const [state, setState] = useState<IState>(() => ({
        readonly: false,
        visible: true,
        ...initialData
    }));

    const action = useMemo(() => ({
        setDisabled: (disabled: IState['disabled']) => setState((prevState) => ({ ...prevState, disabled })),
        setReadonly: (readonly: IState['readonly']) => setState((prevState) => ({ ...prevState, readonly })),
        setVisible: (visible: IState['visible']) => setState((prevState) => ({ ...prevState, visible })),
    }), []);

    return {
        state,
        action,
    };
};

export default useLayoutState;
