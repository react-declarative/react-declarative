import { useState, useMemo } from "react";

import { IConfig } from "../OneConfig/OneConfigInstance";

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
  config: IConfig;
  compute: IField["compute"];
  isVisible: Exclude<IField["isVisible"], undefined>;
  isDisabled: Exclude<IField["isDisabled"], undefined>;
  isInvalid: Exclude<IField["isInvalid"], undefined>;
  isReadonly: Exclude<IField["isReadonly"], undefined>;
}

const readValue = ({ compute, name, object, payload, config }: IParams) => {
  /**
   * Используйте флаг WITH_SYNC_COMPUTE с осторожностью: может вызывать
   * тормоза рендеринга на больших формах
   */
  if (compute && config.WITH_SYNC_COMPUTE) {
    const result = compute(arrays(object), payload);
    return payload instanceof Promise ? false : result;
  }
  /**
   * Чтобы поле input было React-управляемым, нельзя
   * передавать в свойство value значение null
   */
  if (name) {
    return get(object, name) || false;
  }
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
  const [state, setState] = useState<IState>(() => {
    const { visible, ...fieldState } = readState(config);
    return {
      groupRef: null as never,
      focusReadonly: true,
      loading: false,
      ...fieldState,
      visible,
      value: visible ? readValue(config) : false,
      ...initialData,
    };
  });

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
