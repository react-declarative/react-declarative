import * as React from "react";

import Rating from '../../../components/One/slots/RatingSlot';

import makeField from "../components/makeField";

import IManaged, { PickProp } from "../../../model/IManaged";
import IAnything from "../../../model/IAnything";
import IField from "../../../model/IField";

/**
 * Represents the properties for a rating field component.
 *
 * @template Data - The type of data for the field.
 * @template Payload - The type of payload for the field.
 */
export interface IRatingFieldProps<Data = IAnything, Payload = IAnything> {
  /**
   * Retrieves the 'readonly' property value of a given field.
   *
   * @param {IField<Data, Payload>} field - The field object to retrieve the property from.
   *
   * @return {PickProp<IField<Data, Payload>, "readonly">} - The value of the 'readonly' property.
   */
  readonly?: PickProp<IField<Data, Payload>, "readonly">;
  /**
   * Represents the groupRef property of the IField object.
   *
   * @typedef {PickProp<IField<Data, Payload>, 'groupRef'>} groupRef
   * @property {string} [groupRef] - The reference to the group.
   */
  groupRef?: PickProp<IField<Data, Payload>, 'groupRef'>;
  /**
   * Represents the disabled property of an input field.
   *
   * @typedef {PickProp<IField<Data, Payload>, "disabled">} disabled
   */
  disabled?: PickProp<IField<Data, Payload>, "disabled">;
}

/**
 * Interface representing a private rating field.
 *
 * @template Data - The type of data associated with the field.
 */
export interface IRatingFieldPrivate<Data = IAnything> {
  name?: string;
  value: PickProp<IManaged<Data>, "value">;
  readonly: PickProp<IManaged<Data>, "readonly">;
  onChange: PickProp<IManaged<Data>, "onChange">;
}

/**
 * Renders a Rating field component.
 *
 * @param props - The properties for the Rating field.
 * @param props.value - The current value of the Rating field.
 * @param props.disabled - Indicates if the Rating field is disabled.
 * @param props.readonly - Indicates if the Rating field is read-only.
 * @param props.name - The name of the Rating field.
 * @param props.onChange - The function to be called when the value of the Rating field changes.
 *
 * @returns The rendered Rating field component.
 */
export const RatingField = ({
  value,
  disabled,
  readonly,
  name,
  onChange,
}: IRatingFieldProps & IRatingFieldPrivate) => (
  <Rating
    value={value}
    disabled={disabled}
    readonly={readonly}
    name={name}
    onChange={onChange}
  />
);

RatingField.displayName = 'RatingField';

export default makeField(RatingField, {
  withApplyQueue: true,
  skipDebounce: true,
  skipDirtyClickListener: true,
  skipFocusReadonly: true,
});
