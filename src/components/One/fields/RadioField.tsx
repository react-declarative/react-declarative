import * as React from "react";

import Radio from '../../../components/One/slots/RadioSlot';

import makeField from "../components/makeField";

import IField from "../../../model/IField";
import IAnything from "../../../model/IAnything";
import IManaged, { PickProp } from "../../../model/IManaged";

/**
 * Interface for defining props of a radio field component.
 * @template Data - The data type.
 * @template Payload - The payload type.
 */
export interface IRadioFieldProps<Data = IAnything, Payload = IAnything> {
  /**
   * Type definition for the "title" property of an object.
   * It is a generic type that picks the "title" property from a given object type.
   *
   * @template IField - The object type from which to pick the "title" property.
   * @template Data - The data type of the object.
   * @template Payload - The payload type of the object.
   */
  title?: PickProp<IField<Data, Payload>, "title">;
  /**
   * Represents the radio value of a field.
   *
   * @typedef RadioValue
   */
  radioValue?: PickProp<IField<Data, Payload>, "radioValue">;
  /**
   * Represents a reference to a group in a field object.
   *
   * @typedef groupRef
   * @property groupRef - The reference to the group.
   */
  groupRef?: PickProp<IField<Data, Payload>, 'groupRef'>;
  /**
   * Type definition for the "readonly" property of a field.
   *
   * @typedef ReadonlyProp
   *
   * @description
   * This property represents the "readonly" attribute of a field.
   * It is used to indicate whether a field is read-only or not.
   *
   * The value of this property is derived from the "IField" interface
   * in the "Data" module and the "Payload" type.
   */
  readonly?: PickProp<IField<Data, Payload>, "readonly">;
  /**
   * Represents the 'disabled' property of a field.
   *
   * The 'disabled' property determines whether a field is disabled or not. If set to true, the field will be disabled
   * and the user will not be able to interact with it.
   *
   * @template Data The type of data passed to the field.
   * @template Payload The type of payload received by the field.
   * @typedef PickProp
   */
  disabled?: PickProp<IField<Data, Payload>, "disabled">;
}

/**
 * Represents a private interface for a radio field.
 *
 * @template Data - the type of data the radio field manages
 */
export interface IRadioFieldPrivate<Data = IAnything> {
  value: PickProp<IManaged<Data>, "value">;
  onChange: PickProp<IManaged<Data>, "onChange">;
  name?: PickProp<IManaged<Data>, 'name'>;
}

/**
 * RadioField component renders a radio input field with a label.
 *
 * @param props - The props object containing the following properties:
 * @param props.disabled - Determines whether the radio input field is disabled or not.
 * @param props.value - The value for the radio input field.
 * @param props.onChange - The callback function to be called when the value of the radio input field changes.
 * @param props.title - The title/label for the radio input field.
 * @param props.radioValue - The value associated with the radio input field.
 * @param [props.name=''] - The name attribute for the radio input field.
 *
 * @returns - The rendered RadioField component.
 */
export const RadioField = ({
  disabled,
  value,
  onChange,
  title,
  radioValue,
  readonly,
  name = '',
}: IRadioFieldProps & IRadioFieldPrivate) => (
  <Radio
    value={value}
    disabled={disabled}
    readonly={readonly}
    onChange={onChange}
    title={title}
    radioValue={radioValue}
    name={name}
  />
);

RadioField.displayName = 'RadioField';

export default makeField(RadioField, {
  withApplyQueue: true,
  skipDebounce: true,
  skipDirtyClickListener: true,
});
