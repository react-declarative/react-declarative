import { useState, useMemo } from "react";

import { IConfig } from "../../OneConfig/OneConfigInstance";

import get from "../../../../../utils/get";

import IField, { Value } from "../../../../../model/IField";
import IManaged from "../../../../../model/IManaged";
import IAnything from "../../../../../model/IAnything";
import IOneProps from "../../../../../model/IOneProps";

/**
 * Represents the state of a component.
 * @interface
 */
interface IState {
  groupRef: HTMLDivElement;
  focusReadonly: boolean;
  fieldReadonly: boolean;
  disabled: boolean;
  invalid: string | null;
  incorrect: string | null;
  visible: boolean;
  loading: boolean;
  dirty: boolean;
  value: Value;
}

/**
 * @interface IInitialData
 *
 * This interface extends the IState interface and defines the initial data structure
 * for a class implementing it. It excludes certain properties from IState using the Omit
 * utility type.
 *
 * @template IState - The extended interface representing the state.
 */
interface IInitialData
  extends Omit<
    IState,
    keyof {
      groupRef: never;
      fieldReadonly: never;
      focusReadonly: never;
      invalid: never;
      incorrect: never;
      visible: never;
      loading: never;
      value: never;
    }
  > {}

/**
 * Represents a set of parameters used for some functionality.
 *
 * @interface IParams
 */
interface IParams {
  name: IManaged["name"];
  payload: IAnything;
  object: IManaged["object"];
  config: IConfig;
  compute: IField["compute"];
  readTransform: Exclude<IOneProps["readTransform"], undefined>;
  isVisible: Exclude<IField["isVisible"], undefined>;
  isDisabled: Exclude<IField["isDisabled"], undefined>;
  isInvalid: Exclude<IField["isInvalid"], undefined>;
  isIncorrect: Exclude<IField["isIncorrect"], undefined>;
  isReadonly: Exclude<IField["isReadonly"], undefined>;
}

/**
 * Reads the value based on the provided parameters.
 *
 * @param params - The parameters needed to read the value.
 * @param params.compute - The compute function used to compute the value.
 * @param params.name - The name of the property to be read from the object.
 * @param params.object - The object from which to read the value.
 * @param params.payload - The payload to be passed to the compute function.
 * @param params.config - The configuration object.
 * @param visible - The visibility flag.
 *
 * @returns - The value read from the object or false if the value cannot be computed or found.
 */
const readValue = ({ compute, readTransform, name, object, payload, config }: IParams, visible: boolean) => {
  /**
   * Используйте флаг WITH_SYNC_COMPUTE с осторожностью: может вызывать
   * тормоза рендеринга на больших формах
   */
  if (compute && config.WITH_SYNC_COMPUTE) {
    const result = visible ? compute(object, payload) : false;
    return result instanceof Promise ? false : result;
  }
  /**
   * Чтобы поле input было React-управляемым, нельзя
   * передавать в свойство value значение null
   */
  if (!compute && name) {
    return readTransform(get(object, name), name, object, payload) || false;
  }
  return false;
};

const readState = ({
  isReadonly,
  isInvalid,
  isDisabled,
  isVisible,
  isIncorrect,
  object,
  payload,
}: IParams) => ({
  fieldReadonly: isReadonly(object, payload),
  invalid: isInvalid(object, payload),
  visible: isVisible(object, payload),
  incorrect: isIncorrect(object, payload),
  disabled: isDisabled(object, payload),
});

/**
 * useState hook for managing field state.
 * @param initialData - The initial data for the field state.
 * @param config - Configuration parameters for the field state.
 * @returns - An object containing the field state and actions to modify the state.
 */
export const useFieldState = (initialData: IInitialData, config: IParams) => {
  const [state, setState] = useState<IState>(() => {
    const params = readState(config);
    return {
      groupRef: null as never,
      focusReadonly: true,
      loading: false,
      ...params,
      value: readValue(config, params.visible),
      ...initialData,
    };
  });

  /**
   * A utility hook that provides methods to update state values.
   *
   * @returns {Object} An object containing methods to update state values.
   */
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
      setIncorrect: (incorrect: IState["incorrect"]) =>
        setState((prevState) => ({ ...prevState, incorrect })),
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
