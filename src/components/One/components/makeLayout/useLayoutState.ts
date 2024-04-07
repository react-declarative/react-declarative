import { useState, useMemo } from "react";

/**
 * Represents the state of a particular element.
 *
 * @interface IState
 */
interface IState {
    disabled: boolean;
    readonly: boolean;
    visible: boolean;
}

/**
 * Represents an interface for initial data.
 */
interface IInitialData extends Omit<IState, keyof {
    readonly: never;
    visible: never;
}> {}

/**
 * The `useLayoutState` hook is used to manage the state of a component and provide actions to modify that state.
 *
 * @param initialData - The initial data for the state.
 * @returns - An object containing the current state and action functions.
 *
 * @typedef IInitialData - The initial data for the state.
 * @property readonly - Specifies whether the state is read-only or not.
 * @property visible - Specifies whether the state is visible or not.
 *
 * @typedef IState - The state of the component.
 * @property readonly - Specifies whether the state is read-only or not.
 * @property visible - Specifies whether the state is visible or not.
 *
 * @typedef IAction - The actions that can be performed on the state.
 * @property setDisabled - Sets the disabled state of the component.
 * @property setReadonly - Sets the readonly state of the component.
 * @property setVisible - Sets the visible state of the component.
 *
 */
export const useLayoutState = (initialData: IInitialData) => {

    const [state, setState] = useState<IState>(() => ({
        readonly: false,
        /**
         * Позволяет использовать Fiber при рендеринге:
         * разбивает синхронный рекурсивный рендеринг на
         * несколько итераций
         */
        visible: false,
        ...initialData
    }));

    /**
     * A memoized object that contains functions to update state properties.
     *
     * @typedef {Object} Action
     * @property setDisabled - Sets the disabled state property.
     * @property setReadonly - Sets the readonly state property.
     * @property setVisible - Sets the visible state property.
     */
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
