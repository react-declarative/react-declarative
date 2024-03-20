import * as React from "react";
import { Fragment } from "react";
import { useState, useEffect } from "react";

import { makeStyles } from "../../../styles";

import Box from "@mui/material/Box";

import makeField from "../components/makeField";

import { useOnePayload } from "../../../components/One/context/PayloadProvider";
import { useOneState } from "../../../components/One/context/StateProvider";
import { DEFAULT_VALUE, useOneContext } from "../context/OneContextProvider";
import { useOneFeatures } from "../context/FeatureProvider";

import IField from "../../../model/IField";
import IAnything from "../../../model/IAnything";
import IManaged, { PickProp } from "../../../model/IManaged";

import type { ComponentFieldInstanceProps } from "../../../model/ComponentFieldInstance";

import classNames from "../../../utils/classNames";

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

/**
 * Props interface for the IComponentField component.
 *
 * @template Data - The type of data for the field.
 * @template Payload - The type of payload for the field.
 */
export interface IComponentFieldProps<Data = IAnything, Payload = IAnything> {
  placeholder?: PickProp<IField<Data, Payload>, "placeholder">;
  element?: PickProp<IField<Data, Payload>, "element">;
  groupRef?: PickProp<IField<Data, Payload>, "groupRef">;
  className?: PickProp<IField<Data, Payload>, "className">;
  watchOneContext?: PickProp<IField<Data, Payload>, "watchOneContext">;
  style?: PickProp<IField<Data, Payload>, "style">;
  sx?: PickProp<IField<Data, Payload>, "sx">;
}

/**
 * @interface
 * @template Data - The type of data for the component field
 * @description Represents the private interface for a component field
 */
interface IComponentFieldPrivate<Data = IAnything> {
  object: PickProp<IManaged<Data>, "object">;
  disabled: PickProp<IManaged<Data>, "disabled">;
  readonly: PickProp<IManaged<Data>, "readonly">;
  outlinePaper?: PickProp<IField<Data>, "outlinePaper">;
  transparentPaper?: PickProp<IField<Data>, "transparentPaper">;
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

/**
 * Represents a component field.
 * @param props - The component props.
 * @param props.disabled - Indicates if the field is disabled.
 * @param props.readonly - Indicates if the field is readonly.
 * @param props.watchOneContext - Indicates if the field should watch the One context.
 * @param props.element - The element to render, default is Fragment.
 * @param props.outlinePaper - Indicates if the field should have an outline paper.
 * @param props.transparentPaper - Indicates if the field should have a transparent paper.
 * @param props.object - A generic object to pass to the field.
 * @param props.otherProps - Other props to pass to the field.
 * @param - The rendered field component.
 */
export const ComponentField = ({
  disabled,
  readonly,
  watchOneContext,
  element: Element = () => <Fragment />,
  outlinePaper,
  transparentPaper,
  object,
  ...otherProps
}: IComponentFieldProps & IComponentFieldPrivate) => {
  const { classes } = useStyles();

  const [node, setNode] = useState<JSX.Element | null>(null);
  const { changeObject: handleChange } = useOneState();
  const payload = useOnePayload();
  const features = useOneFeatures();

  useEffect(() => {
    const _fieldParams = Object.entries(otherProps as IField)
      .filter(
        ([key]) => !FIELD_INTERNAL_PARAMS.includes(key as FieldIgnoreParam)
      )
      .reduce((acm, [key, value]) => ({ ...acm, [key]: value }), {}) as IField;
    const props = {
      ...object,
      onChange: handleChange,
      _fieldParams,
      _fieldData: object,
      outlinePaper,
      transparentPaper,
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
  skipFocusBlurCall: true,
  skipDebounce: true,
});
