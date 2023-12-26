import * as React from "react";
import { Fragment } from "react";
import { useState, useEffect, useCallback } from "react";

import { makeStyles } from "../../../styles";

import Box from "@mui/material/Box";

import makeField from "../components/makeField";

import { useOnePayload } from "../../../components/One/context/PayloadProvider";
import { useOneState } from "../../../components/One/context/StateProvider";
import { DEFAULT_VALUE, useOneContext } from "../context/OneContextProvider";
import { useOneFeatures } from "../context/FeatureProvider";

import { useActualValue } from "../../../hooks/useActualValue";

import IField from "../../../model/IField";
import IAnything from "../../../model/IAnything";
import IManaged, { PickProp } from "../../../model/IManaged";

import type { ComponentFieldInstanceProps } from "../../../model/ComponentFieldInstance";

import classNames from "../../../utils/classNames";
import deepClone from "../../../utils/deepClone";

type FieldIgnoreParam = keyof Omit<IManaged, keyof IField> | "readonly";

const FIELD_NEVER_MARGIN = "0";

const FIELD_INTERNAL_PARAMS: FieldIgnoreParam[] = [
  "dirty",
  "fallback",
  "readonly",
  "invalid",
  "loading",
  "object",
  "onChange",
  "prefix",
  "value",
];

export interface IComponentFieldProps<Data = IAnything, Payload = IAnything> {
  placeholder?: PickProp<IField<Data, Payload>, "placeholder">;
  element?: PickProp<IField<Data, Payload>, "element">;
  groupRef?: PickProp<IField<Data, Payload>, "groupRef">;
  className?: PickProp<IField<Data, Payload>, "className">;
  watchOneContext?: PickProp<IField<Data, Payload>, "watchOneContext">;
  style?: PickProp<IField<Data, Payload>, "style">;
  sx?: PickProp<IField<Data, Payload>, "sx">;
}

interface IComponentFieldPrivate<Data = IAnything> {
  object: PickProp<IManaged<Data>, "object">;
  disabled: PickProp<IManaged<Data>, "disabled">;
  readonly: PickProp<IManaged<Data>, "readonly">;
  outlinePaper?: PickProp<IField<Data>, "outlinePaper">;
}

const useStyles = makeStyles()({
  root: {
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
    "& > *": {
      flex: 1,
    },
  },
  disabled: {
    pointerEvents: "none",
    opacity: 0.5,
  },
  readonly: {
    pointerEvents: "none",
  },
});

const ComponentInstance = ({
    Element,
    ...props
}: ComponentFieldInstanceProps) => {
    const context = useOneContext();
    return (
        <Element
            {...props}
            context={context}
        />
    );
};

export const ComponentField = ({
  disabled,
  readonly,
  watchOneContext,
  element: Element = () => <Fragment />,
  outlinePaper,
  object,
  ...otherProps
}: IComponentFieldProps & IComponentFieldPrivate) => {
  const { classes } = useStyles();

  const object$ = useActualValue(object);

  const [node, setNode] = useState<JSX.Element | null>(null);
  const { setObject } = useOneState();
  const payload = useOnePayload();
  const features = useOneFeatures();

  const handleChange = useCallback(
    (object: unknown) => setObject(deepClone(object), {}),
    []
  );

  useEffect(() => {
    const _fieldParams = Object.entries(otherProps as IField)
      .filter(
        ([key]) => !FIELD_INTERNAL_PARAMS.includes(key as FieldIgnoreParam)
      )
      .reduce((acm, [key, value]) => ({ ...acm, [key]: value }), {}) as IField;
    const onChange = (data: Record<string, any>) =>
      handleChange({ ...object$.current, ...data });
    const _fieldData = object;
    const props = {
      ..._fieldData,
      onChange,
      _fieldParams,
      _fieldData,
      outlinePaper,
      payload,
      disabled,
      readonly,
      features,
    };
    if (watchOneContext) {
        setNode(() => <ComponentInstance {...props} Element={Element} />);
        return;
    }
    setNode(() => <Element {...props} context={DEFAULT_VALUE} />);
  }, [object, disabled, readonly]);

  return (
    <Box
      className={classNames(classes.root, {
        [classes.disabled]: disabled,
        [classes.readonly]: readonly,
      })}
    >
      {node}
    </Box>
  );
};

ComponentField.displayName = "ComponentField";

export default makeField(ComponentField, {
  defaultProps: {
    fieldRightMargin: FIELD_NEVER_MARGIN,
    fieldBottomMargin: FIELD_NEVER_MARGIN,
  },
  withApplyQueue: true,
  skipDirtyClickListener: true,
  skipFocusReadonly: true,
  skipDebounce: true,
});
