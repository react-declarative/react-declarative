import * as React from "react";

import Rating from '../../../components/One/slots/RatingSlot';

import makeField from "../components/makeField";

import IManaged, { PickProp } from "../../../model/IManaged";
import IAnything from "../../../model/IAnything";
import IField from "../../../model/IField";

export interface IRatingFieldProps<Data = IAnything, Payload = IAnything> {
  readonly?: PickProp<IField<Data, Payload>, "readonly">;
  groupRef?: PickProp<IField<Data, Payload>, 'groupRef'>;
  disabled?: PickProp<IField<Data, Payload>, "disabled">;
}

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
