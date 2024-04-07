import * as React from 'react';

import Switch from '../../../components/One/slots/SwitchSlot';

import makeField from '../components/makeField';

import IManaged, { PickProp } from '../../../model/IManaged';
import IAnything from '../../../model/IAnything';
import IField from '../../../model/IField';

/**
 * Represents the properties for a switch field component.
 *
 * @template Data - The type of data for the field.
 * @template Payload - The type of payload for the field.
 */
export interface ISwitchFieldProps<Data = IAnything, Payload = IAnything>  {
  /**
   * Retrieves the value of the 'title' property from an object of type IField<Data, Payload>.
   *
   * @template Data - The type of the data contained in the field.
   * @template Payload - The type of the payload associated with the field.
   *
   * @param field - An object of type IField<Data, Payload>.
   *
   * @returns - The value of the 'title' property from the given field.
   */
  title?: PickProp<IField<Data, Payload>, 'title'>;
  /**
   * Retrieves the 'groupRef' property from an object based on the given type.
   *
   * @template Data - The type of data in the object containing the 'groupRef' property.
   * @template Payload - The type representing the payload of the 'groupRef' property.
   * @template IField - The interface describing the object structure.
   *
   * @param groupRef - The object containing the 'groupRef' property to retrieve.
   *
   * @returns - The 'groupRef' property from the given object.
   */
  groupRef?: PickProp<IField<Data, Payload>, 'groupRef'>;
  /**
   * Represents the readonly property of an IField object.
   *
   * @typedef {PickProp<IField<Data, Payload>, "readonly">} readonly?
   * @property [readonly] - Specifies whether the field is readonly or not.
   * @public
   */
  readonly?: PickProp<IField<Data, Payload>, "readonly">;
  /**
   * Represents the 'disabled' property of a field in a form.
   *
   * @template Data The data type associated with the form.
   * @template Payload The payload type associated with the form.
   * @typedef {PickProp<IField<Data, Payload>, 'disabled'>} disabled
   */
  disabled?: PickProp<IField<Data, Payload>, "disabled">;
  /**
   * The switchNoColor property of the Field interface.
   *
   * @typedef {PickProp<IField<Data, Payload>, "switchNoColor">} switchNoColor
   */
  switchNoColor?: PickProp<IField<Data, Payload>, "switchNoColor">;
  /**
   * Gets the value of the switchActiveLabel property from the given field.
   *
   * @param field - The field object from which to get the switchActiveLabel property.
   * @returns - The value of the switchActiveLabel property.
   */
  switchActiveLabel?: PickProp<IField<Data, Payload>, "switchActiveLabel">;
}

/**
 * Represents a private interface for a switch field.
 *
 * @template Data - The type of data associated with the switch field.
 */
export interface ISwitchFieldPrivate<Data = IAnything>  {
  onChange: PickProp<IManaged<Data>, 'onChange'>;
  value: PickProp<IManaged<Data>, 'value'>;
}

/**
 * Renders a Switch field component.
 *
 * @param props - The properties for the Switch field.
 * @param props.disabled - Indicates whether the Switch field is disabled.
 * @param props.value - The current value of the Switch field.
 * @param props.readonly - Indicates whether the Switch field is read-only.
 * @param props.onChange - The event handler for when the Switch field is changed.
 * @param props.switchNoColor - Indicates whether the Switch field has no color.
 * @param props.switchActiveLabel - The label for the active state of the Switch field.
 * @param props.title - The title of the Switch field.
 *
 * @returns A Switch component wrapped in a SwitchField component.
 */
export const SwitchField = ({
  disabled,
  value,
  readonly,
  onChange,
  switchNoColor,
  switchActiveLabel,
  title,
}: ISwitchFieldProps & ISwitchFieldPrivate) => (
  <Switch
    readonly={readonly}
    disabled={disabled}
    value={value}
    onChange={onChange}
    switchNoColor={switchNoColor}
    switchActiveLabel={switchActiveLabel}
    title={title}
  />
);

SwitchField.displayName = 'SwitchField';

export default makeField(SwitchField, {
  withApplyQueue: true,
  skipDebounce: true,
  skipDirtyClickListener: true,
  skipFocusReadonly: true,
});
