import { useState, useMemo } from "react";

import { Value } from "../../../../model/IField";

interface IState {
    groupRef: HTMLDivElement;
    focusReadonly: boolean;
    fieldReadonly: boolean;
    disabled: boolean;
    invalid: string | null;
    visible: boolean;
    loading: boolean;
    dirty: boolean;
    value: Value;
}

interface IInitialData extends Omit<IState, keyof {
    groupRef: never;
    focusReadonly: never;
    invalid: never;
    visible: never;
    loading: never;
    value: never;
}> {}

export const useFieldState = (initialData: IInitialData) => {

    const [state, setState] = useState<IState>(() => ({
        groupRef: null as never,
        focusReadonly: true,
        invalid: null,
        visible: true,
        loading: false,
        /**
         * Чтобы поле input было React-управляемым, нельзя
         * передавать в свойство value значение null
         */
        value: false,
        ...initialData,
    }));

    const action = useMemo(() => ({
        setGroupRef: (groupRef: IState['groupRef']) => setState((prevState) => ({ ...prevState, groupRef })),
        setFocusReadonly: (focusReadonly: IState['focusReadonly']) => setState((prevState) => ({ ...prevState, focusReadonly })),
        setFieldReadonly: (fieldReadonly: IState['fieldReadonly']) => setState((prevState) => ({ ...prevState, fieldReadonly })),
        setDisabled: (disabled: IState['disabled']) => setState((prevState) => ({ ...prevState, disabled })),
        setInvalid: (invalid: IState['invalid']) => setState((prevState) => ({ ...prevState, invalid })),
        setVisible: (visible: IState['visible']) => setState((prevState) => ({ ...prevState, visible })),
        setLoading: (loading: IState['loading']) => setState((prevState) => ({ ...prevState, loading })),
        setDirty: (dirty: IState['dirty']) => setState((prevState) => ({ ...prevState, dirty })),
        setValue: (value: IState['value']) => setState((prevState) => ({ ...prevState, value })),
    }), []);

    return {
        state,
        action,
    };
};

export default useFieldState;
