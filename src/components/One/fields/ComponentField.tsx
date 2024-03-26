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
  /**
   * Type definition for the 'name' property of an object.
   * The 'name' property is extracted from a specific type and is used to pick a specific property from that type.
   *
   * @template Data The data type to extract the property from.
   * @template Payload The type of the property to pick.
   *
   * @typedef {PickProp<IField<Data, Payload>, "name">} name
   */
  name?: PickProp<IField<Data, Payload>, "name">;
  /**
   * Type definition for the `placeholder` property of a field.
   *
   * @template Data - The type of data associated with the field.
   * @template Payload - The type of payload used for updating the field.
   */
  placeholder?: PickProp<IField<Data, Payload>, "placeholder">;
  /**
   * Retrieves the "element" property from the given object
   *
   * @param {PickProp<IField<Data, Payload>, "element">} element - The object to extract the "element" property from
   * @returns {PickProp<IField<Data, Payload>, "element">} - The value of the "element" property
   */
  element?: PickProp<IField<Data, Payload>, "element">;
  /**
   * Represents a property of an object, where the key is "groupRef" and the value is of type PickProp<IField<Data, Payload>, "groupRef">.
   *
   * @property {PickProp<IField<Data, Payload>, "groupRef">} groupRef - The 'groupRef' property of the object.
   */
  groupRef?: PickProp<IField<Data, Payload>, "groupRef">;
  /**
   * Retrieves the "className" property from an object of type PickProp<IField<Data, Payload>, "className">.
   *
   * @param {PickProp<IField<Data, Payload>, "className">} obj - The input object containing the "className" property.
   * @returns {undefined | PickProp<IField<Data, Payload>, "className">} - The value of the "className" property if present, otherwise undefined.
   * @throws {TypeError} If the input object is not of the expected type.
   */
  className?: PickProp<IField<Data, Payload>, "className">;
  /**
   * Represents the contextual information for watching a single field in a data structure.
   * @typedef {PickProp<IField<Data, Payload>, "watchOneContext">} watchOneContext?
   */
  watchOneContext?: PickProp<IField<Data, Payload>, "watchOneContext">;
  /**
   * Returns the style property of the given variable.
   *
   * @template T - The type of the variable.
   * @template K - The type of the property to be picked.
   * @param {T} obj - The variable from which to pick the property.
   * @param {K} prop - The property to pick from the variable.
   * @returns {Pick<T, K>} - The picked property value.
   */
  style?: PickProp<IField<Data, Payload>, "style">;
  /**
   * Represents the 'sx' property of a PickProp.
   *
   * @template IField - The input field type.
   * @template Data - The data type.
   * @template Payload - The payload type.
   *
   * @param {IField<Data, Payload>} - The input field.
   *
   * @returns {PickProp<IField<Data, Payload>, "sx"> | undefined} - The value of the 'sx' property.
   */
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
  invalid: PickProp<IManaged<Data>, "invalid">;
  incorrect: PickProp<IManaged<Data>, "incorrect">;
  readonly: PickProp<IManaged<Data>, "readonly">;
  onChange: PickProp<IManaged<Data>, "onChange">;
  outlinePaper?: PickProp<IField<Data>, "outlinePaper">;
  transparentPaper?: PickProp<IField<Data>, "transparentPaper">;
}

/**
 * A function that returns a style object based on the given configuration
 *
 * @returns {Object} The style object containing the defined CSS properties
 */
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
  invalid,
  incorrect,
  readonly,
  watchOneContext,
  element: Element = () => <Fragment />,
  outlinePaper,
  transparentPaper,
  object,
  onChange: onValueChange,
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
      onValueChange,
      _fieldParams,
      _fieldData: object,
      outlinePaper,
      transparentPaper,
      invalid,
      incorrect,
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
  }, [object, disabled, invalid, incorrect, readonly]);

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
