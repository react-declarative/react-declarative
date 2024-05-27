import * as React from "react";

import Choose from '../../../components/One/slots/ChooseSlot';

import makeField from "../components/makeField";

import IManaged, { PickProp } from "../../../model/IManaged";
import IAnything from "../../../model/IAnything";
import IField from "../../../model/IField";

/**
 * Props for the IChooseField component.
 *
 * @template Data - The data type of the field.
 * @template Payload - The payload type of the field.
 */
export interface IChooseFieldProps<Data = IAnything, Payload = IAnything> {
  /**
   * Validation factory config
   *
   * @template IField - Type representing the field object.
   * @template Data - Type representing the data object.
   * @template Payload - Type representing the payload object.
   * 
   * @returns The value of the "validation" property.
   */
  validation?: PickProp<IField<Data, Payload>, 'validation'>;
  /**
   * Retrieves the "description" property from the given object.
   *
   * @template IField - Type representing the field object.
   * @template Data - Type representing the data object.
   * @template Payload - Type representing the payload object.
   *
   * @param obj - The object from which to pick the "description" property.
   *
   * @returns The value of the "description" property.
   */
  description?: PickProp<IField<Data, Payload>, "description">;
  /**
   * Type definition for the `PickProp` function.
   *
   * @template T - The type of the object to pick properties from.
   * @template K - The keys to pick from the object.
   */
  outlined?: PickProp<IField<Data, Payload>, "outlined">;
  /**
   * Type definition for the `title` property when using `PickProp` utility.
   * @template T - The type of the object from which to pick the property.
   * @template Prop - The name of the property to pick.
   * @param obj - The object from which to pick the property.
   * @param prop - The name of the property to pick.
   * @returns - The picked property value.
   */
  title?: PickProp<IField<Data, Payload>, "title">;
  /**
   * Type definition for a generic placeholder value.
   * @typedef Placeholder
   */
  placeholder?: PickProp<IField<Data, Payload>, "placeholder">;
  /**
   * Represents the configuration for label shrinking in a field.
   *
   * @typedef LabelShrink
   */
  labelShrink?: PickProp<IField<Data>, "labelShrink">;
  /**
   * A variable that represents the `readonly` property of a field.
   *
   * @typedef readonly? - The `readonly` property of a field.
   */
  readonly?: PickProp<IField<Data, Payload>, "readonly">;
  /**
   * Type definition for the "disabled" property of a field.
   *
   * This type is used to define the "disabled" property of a field from an object type "Data"
   * and a type "Payload" using the PickProp utility type.
   *
   * @template Data - The type representing the object structure.
   * @template Payload - The type representing the additional properties of the field.
   * @typedef disabled
   */
  disabled?: PickProp<IField<Data, Payload>, "disabled">;
  /**
   * A reference to the group that the field belongs to.
   *
   * @typedef groupRef
   *
   * @property id - The unique identifier of the group.
   * @property name - The name of the group.
   * @property description - The description of the group.
   */
  groupRef?: PickProp<IField<Data, Payload>, 'groupRef'>;
  /**
   * This variable represents the `inputRef` property of type `PickProp<IField<Data, Payload>, 'inputRef'>`.
   * It is an optional property, which means it may be undefined.
   *
   * @typedef InputRef
   */
  inputRef?: PickProp<IField<Data, Payload>, 'inputRef'>;
  /**
   * Type definition for the 'choose' property of IField.
   *
   * @template Data - The data type of the field.
   * @template Payload - The data payload for the field.
   */
  choose?: PickProp<IField<Data, Payload>, 'choose'>;
  /**
   * Represents a possible translation for a field in a form.
   *
   * @typedef tr
   * @property type - The type of translation.
   * @property required - Indicates if the translation is required.
   * @property options - The list of available translation options.
   * @property defaultValue - The default translation value.
   */
  tr?: PickProp<IField<Data, Payload>, 'tr'>;
}

/**
 * Represents an interface for choosing private fields.
 *
 * @template Data - The type of data for the private fields.
 */
export interface IChooseFieldPrivate<Data = IAnything> {
  onChange: PickProp<IManaged<Data>, "onChange">;
  invalid: PickProp<IManaged<Data>, "invalid">;
  incorrect: PickProp<IManaged<Data>, "incorrect">;
  value: PickProp<IManaged<Data>, "value">;
  loading: PickProp<IManaged<Data>, "loading">;
  disabled: PickProp<IManaged<Data>, "disabled">;
  dirty: PickProp<IManaged<Data>, "dirty">;
  name: PickProp<IManaged<Data>, "name">;
  withContextMenu: PickProp<IManaged<Data>, "withContextMenu">;
}

/**
 * Represents the ChooseField component.
 * @param options - The options for the ChooseField component.
 * @returns The rendered ChooseField component.
 */
export const ChooseField = ({
  invalid,
  value,
  disabled,
  readonly,
  incorrect,
  description = "",
  outlined = false,
  title = "",
  placeholder = "",
  labelShrink,
  choose,
  tr,
  dirty,
  loading,
  onChange,
  inputRef,
  name,
  withContextMenu,
}: IChooseFieldProps & IChooseFieldPrivate) => (
  <Choose
    inputRef={inputRef}
    invalid={invalid}
    incorrect={incorrect}
    value={value}
    readonly={readonly}
    disabled={disabled}
    labelShrink={labelShrink}
    description={description}
    outlined={outlined}
    title={title}
    placeholder={placeholder}
    withContextMenu={withContextMenu}
    choose={choose}
    tr={tr}
    dirty={dirty}
    loading={loading}
    onChange={onChange}
    name={name}
  />
);

ChooseField.displayName = 'ChooseField';

export default makeField(ChooseField, {
  withApplyQueue: true,
  skipDirtyClickListener: true,
  skipFocusReadonly: true,
  skipFocusBlurCall: true,
  skipDebounce: true,
});
