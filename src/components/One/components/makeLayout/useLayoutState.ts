import { useState, useMemo } from "react";

import IAnything from "../../../../model/IAnything";
import IManaged from "../../../../model/IManaged";
import IField from "../../../../model/IField";

interface IState {
    disabled: boolean;
    readonly: boolean;
    visible: boolean;
}

interface IParams {
    payload: IAnything;
    object: IManaged["object"];
    isVisible: Exclude<IField["isVisible"], undefined>;
    isDisabled: Exclude<IField["isDisabled"], undefined>;
    isReadonly: Exclude<IField["isReadonly"], undefined>;
}

export const useLayoutState = ({
    object,
    payload,
    isVisible,
    isDisabled,
    isReadonly,
}: IParams) => {

    const [state, setState] = useState<IState>(() => ({
        disabled: isDisabled(object, payload),
        visible: isVisible(object, payload),
        readonly: isReadonly(object, payload),
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
