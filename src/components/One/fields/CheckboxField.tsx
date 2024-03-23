import * as React from 'react';

import CheckBox from '../../../components/One/slots/CheckBoxSlot';

import makeField from "../components/makeField";

import IManaged, { PickProp } from '../../../model/IManaged';
import IAnything from '../../../model/IAnything';
import IField from '../../../model/IField';

/**
 * Interface representing props for the CheckboxField component.
 *
 * @template Data - The type of data for the field.
 * @template Payload - The type of payload for the field.
 */
export interface ICheckboxFieldProps<Data = IAnything, Payload = IAnything> {
  /**
   * Retrieves the 'title' property from the given variable.
   *
   * @template T - The type of the variable.
   * @template K - The key to pick from the variable.
   *
   * @param {T} variable - The variable to pick the property from.
   *
   * @returns {Pick<T, K>} - The picked property.
   */
  title?: PickProp<IField<Data, Payload>, 'title'>;
  /**
   * Retrieves the value of the 'readonly' property from the given object.
   *
   * @template Data - The type of data stored in the field.
   * @template Payload - The type of payload used in the field.
   * @template T - The type of the field object.
   *
   * @param {T} field - The field object.
   *
   * @returns {PickProp<T, "readonly">}
   * The value of the 'readonly' property from the field object.
   */
  readonly?: PickProp<IField<Data, Payload>, "readonly">;
  /**
   * Represents the "disabled" property of a field in the given data payload.
   *
   * @template Data - The type of the data payload.
   * @template Payload - The type of the payload object.
   *
   * @param {PickProp<IField<Data, Payload>, "disabled">} disabled - The value of the "disabled" property.
   *
   * @returns {void}
   */
  disabled?: PickProp<IField<Data, Payload>, "disabled">;
  /**
   * Represents the optional property `groupRef` from the `IField` interface.
   * The `groupRef` property is a subset of the `PickProp` type with the 'groupRef' key.
   *
   * @typedef {PickProp<IField<Data, Payload>, 'groupRef'>} groupRef
   */
  groupRef?: PickProp<IField<Data, Payload>, 'groupRef'>;
}

/**
 * Represents a private interface for a Checkbox field.
 * @interface
 * @template Data - The type of data associated with the Checkbox field.
 */
export interface ICheckboxFieldPrivate<Data = IAnything>  {
  value: PickProp<IManaged<Data>, 'value'>;
  onChange: PickProp<IManaged<Data>, 'onChange'>;
}

/**
 * Represents a checkbox field component.
 *
 * @param param - The properties for the checkbox field.
 * @returns - The checkbox field component.
 */
export const CheckboxField = ({
  disabled,
  value,
  readonly,
  onChange,
  title
}: ICheckboxFieldProps & ICheckboxFieldPrivate) => (
  <CheckBox
    disabled={disabled}
    value={value}
    readonly={readonly}
    onChange={onChange}
    title={title}
  />
);

CheckboxField.displayName = 'CheckboxField';

export default makeField(CheckboxField, {
  withApplyQueue: true,
  skipDebounce: true,
  skipDirtyClickListener: true,
});
