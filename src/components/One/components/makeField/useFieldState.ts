import { useState, useMemo } from "react";

import IField, { Value } from "../../../../model/IField";
import IManaged from "../../../../model/IManaged";
import IAnything from "../../../../model/IAnything";

import get from "../../../../utils/get";
import arrays from "../../../../utils/arrays";

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

interface IInitialData
  extends Omit<
    IState,
    keyof {
      groupRef: never;
      fieldReadonly: never;
      focusReadonly: never;
      invalid: never;
      visible: never;
      loading: never;
      value: never;
    }
  > {}

interface IParams {
  name: IManaged["name"];
  payload: IAnything;
  object: IManaged["object"];
  compute: IField["compute"];
  isVisible: Exclude<IField["isVisible"], undefined>;
  isDisabled: Exclude<IField["isDisabled"], undefined>;
  isInvalid: Exclude<IField["isInvalid"], undefined>;
  isReadonly: Exclude<IField["isReadonly"], undefined>;
}

const readValue = ({ compute, name, object, payload }: IParams) => {
    if (compute) {
        const result = compute(arrays(object), payload);
        return payload instanceof Promise ? false : result;
    }
    if (name) {
        return get(object, name);
    }
    /**
     * Чтобы поле input было React-управляемым, нельзя
     * передавать в свойство value значение null
     */
    return false;
};

const readState = ({
  isReadonly,
  isInvalid,
  isDisabled,
  isVisible,
  object,
  payload,
}: IParams) => ({
  fieldReadonly: isReadonly(object, payload),
  invalid: isInvalid(object, payload),
  visible: isVisible(object, payload),
  disabled: isDisabled(object, payload),
});

export const useFieldState = (initialData: IInitialData, config: IParams) => {
  const [state, setState] = useState<IState>(() => ({
    groupRef: null as never,
    focusReadonly: true,
    loading: false,
    ...readState(config),
    value: readValue(config),
    ...initialData,
  }));

  const action = useMemo(
    () => ({
      setGroupRef: (groupRef: IState["groupRef"]) =>
        setState((prevState) => ({ ...prevState, groupRef })),
      setFocusReadonly: (focusReadonly: IState["focusReadonly"]) =>
        setState((prevState) => ({ ...prevState, focusReadonly })),
      setFieldReadonly: (fieldReadonly: IState["fieldReadonly"]) =>
        setState((prevState) => ({ ...prevState, fieldReadonly })),
      setDisabled: (disabled: IState["disabled"]) =>
        setState((prevState) => ({ ...prevState, disabled })),
      setInvalid: (invalid: IState["invalid"]) =>
        setState((prevState) => ({ ...prevState, invalid })),
      setVisible: (visible: IState["visible"]) =>
        setState((prevState) => ({ ...prevState, visible })),
      setLoading: (loading: IState["loading"]) =>
        setState((prevState) => ({ ...prevState, loading })),
      setDirty: (dirty: IState["dirty"]) =>
        setState((prevState) => ({ ...prevState, dirty })),
      setValue: (value: IState["value"]) =>
        setState((prevState) => ({ ...prevState, value })),
    }),
    []
  );

  return {
    state,
    action,
  };
};

export default useFieldState;
