import * as React from 'react';

import Button from '../../../components/One/slots/ButtonSlot';

import makeField from "../components/makeField";

import IManaged, { PickProp } from '../../../model/IManaged';
import IAnything from '../../../model/IAnything';
import IField from '../../../model/IField';

/**
 * Interface representing props for the ButtonField component.
 *
 * @template Data - The type of data for the field.
 * @template Payload - The type of payload for the field.
 */
export interface IButtonFieldProps<Data = IAnything, Payload = IAnything> {
  /**
   * Retrieves the 'buttonVariant' property from the given variable.
   *
   * @template T - The type of the variable.
   * @template K - The key to pick from the variable.
   *
   * @param variable - The variable to pick the property from.
   *
   * @returns - The picked property.
   */
  buttonVariant?: PickProp<IField<Data, Payload>, 'buttonVariant'>;

  /**
   * Retrieves the 'buttonSize' property from the given variable.
   *
   * @template T - The type of the variable.
   * @template K - The key to pick from the variable.
   *
   * @param variable - The variable to pick the property from.
   *
   * @returns - The picked property.
   */
  buttonSize?: PickProp<IField<Data, Payload>, 'buttonSize'>;

  /**
   * Retrieves the 'buttonSize' property from the given variable.
   *
   * @template T - The type of the variable.
   * @template K - The key to pick from the variable.
   *
   * @param variable - The variable to pick the property from.
   *
   * @returns - The picked property.
   */
  buttonColor?: PickProp<IField<Data, Payload>, 'buttonColor'>;

  /**
   * Retrieves the 'icon' property from the given variable.
   *
   * @template T - The type of the variable.
   * @template K - The key to pick from the variable.
   *
   * @param variable - The variable to pick the property from.
   *
   * @returns - The picked property.
   */
  icon?: PickProp<IField<Data, Payload>, 'icon'>;
  /**
   * Retrieves the 'title' property from the given variable.
   *
   * @template T - The type of the variable.
   * @template K - The key to pick from the variable.
   *
   * @param variable - The variable to pick the property from.
   *
   * @returns - The picked property.
   */
  title?: PickProp<IField<Data, Payload>, 'title'>;
  /**
   * Retrieves the 'placeholder' property from the given variable.
   *
   * @template T - The type of the variable.
   * @template K - The key to pick from the variable.
   *
   * @param variable - The variable to pick the property from.
   *
   * @returns - The picked property.
   */
  placeholder?: PickProp<IField<Data, Payload>, 'placeholder'>;
  /**
   * Represents the "disabled" property of a field in the given data payload.
   *
   * @template Data - The type of the data payload.
   * @template Payload - The type of the payload object.
   *
   * @param disabled - The value of the "disabled" property.
   *
   * @returns
   */
  disabled?: PickProp<IField<Data, Payload>, "disabled">;
  /**
   * Represents the optional property `groupRef` from the `IField` interface.
   * The `groupRef` property is a subset of the `PickProp` type with the 'groupRef' key.
   *
   * @typedef groupRef
   */
  groupRef?: PickProp<IField<Data, Payload>, 'groupRef'>;
}

/**
 * Represents a private interface for a Button field.
 * @interface
 * @template Data - The type of data associated with the Button field.
 */
export interface IButtonFieldPrivate<Data = IAnything> {
  value: PickProp<IManaged<Data>, 'value'>;
  click: PickProp<IManaged<Data>, 'click'>;
}

/**
 * Represents a button field component.
 *
 * @param param - The properties for the button field.
 * @returns - The button field component.
 */
export const ButtonField = ({
  disabled,
  click,
  icon,
  title,
  value,
  buttonSize,
  buttonVariant,
  buttonColor,
  placeholder,
}: IButtonFieldProps & IButtonFieldPrivate) => (
  <Button
    disabled={disabled}
    click={click}
    icon={icon}
    title={title}
    value={value}
    buttonVariant={buttonVariant}
    buttonColor={buttonColor}
    buttonSize={buttonSize}
    placeholder={placeholder}
  />
);

ButtonField.displayName = 'ButtonField';

export default makeField(ButtonField, {
  skipClickListener: true,
  withApplyQueue: true,
  skipDebounce: true,
  skipDirtyClickListener: true,
});
