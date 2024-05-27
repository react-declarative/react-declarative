import * as React from "react";

import File from '../../../components/One/slots/FileSlot';

import makeField from "../components/makeField";

import IManaged, { PickProp } from "../../../model/IManaged";
import IAnything from "../../../model/IAnything";
import IField from "../../../model/IField";

/**
 * Interface representing props for the IFileField component.
 * @template Data - The data type for the field.
 * @template Payload - The payload type for the field.
 */
export interface IFileFieldProps<Data = IAnything, Payload = IAnything> {
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
   * Type definition for the `PickProp` function.
   * Extracts a specific property `description` from a given object type `IField<Data, Payload>`.
   *
   * @template Data - The type of data associated with the field.
   * @template Payload - The type of payload associated with the field.
   * @template T - The type of the object from which to pick the `description` property.
   *
   * @param object - The object from which to pick the `description` property.
   * @return - The value of the `description` property if found, otherwise `undefined`.
   */
  description?: PickProp<IField<Data, Payload>, "description">;
  /**
   * Picks the "outlined" property from a given object type.
   */
  outlined?: PickProp<IField<Data, Payload>, "outlined">;
  /**
   * Type definition for the 'title' property of the PickProp utility.
   *
   * @template T - The type of object from which to pick the property.
   * @template K - The key of the property to be picked.
   */
  title?: PickProp<IField<Data, Payload>, "title">;
  /**
   * Type definition for the placeholder property of a field.
   *
   * @template T - The type of the field.
   * @template K - The key of the property to pick.
   * @template Data - The data object containing the field.
   * @template Payload - The payload type for the field.
   *
   * @typedef PickProp
   *
   * @param field - The field object.
   *
   * @returns - The value of the field's placeholder property.
   */
  placeholder?: PickProp<IField<Data, Payload>, "placeholder">;
  /**
   * Represents the `fileAccept` property of a field.
   *
   * @template Data - The type of data associated with the field.
   * @template Payload - The type of payload associated with the field.
   *
   * @typedef fileAccept
   *
   * @property fileAccept - The accepted file types for the field.
   */
  fileAccept?: PickProp<IField<Data, Payload>, 'fileAccept'>;
  /**
   * Retrieves the value of the "readonly" property from the provided object.
   *
   * @template IField - The type of the object containing the "readonly" property.
   * @template Data - The type of the data stored in the "IField" object.
   * @template Payload - The type of the payload stored in the "IField" object.
   *
   * @param obj - The object from which to retrieve the "readonly" property.
   *
   * @returns - The value of the "readonly" property, or undefined if it is not present.
   */
  readonly?: PickProp<IField<Data, Payload>, "readonly">;
  /**
   * Represents the "disabled" property of a field.
   *
   * @typedef DisabledField
   */
  disabled?: PickProp<IField<Data, Payload>, "disabled">;
  /**
   * Represents a reference to a group within a field.
   *
   * @typedef groupRef
   */
  groupRef?: PickProp<IField<Data, Payload>, 'groupRef'>;
  /**
   * Represents the input reference associated with a field in a specific data payload.
   *
   * @typedef IInputRef
   * @property inputRef - The input reference value.
   */
  inputRef?: PickProp<IField<Data, Payload>, 'inputRef'>;
  /**
   * Label shrink value from the field data.
   *
   * @typedef labelShrink
   * @property [labelShrink] - The label shrink value from the field data.
   * @private
   */
  labelShrink?: PickProp<IField<Data>, "labelShrink">;
  /**
   * Represents the 'upload' property of a given object.
   *
   * @template Data - The type of data for the object containing the 'upload' property.
   * @template Payload - The type of payload for the 'upload' property.
   * @template IField - The type of field for the object containing the 'upload' property.
   * @typedef upload
   */
  upload?: PickProp<IField<Data, Payload>, 'upload'>;
  /**
   * This variable represents a property 'view' extracted from an object of type PickProp<IField<Data, Payload>, 'view'>.
   * The 'view' property is used to specify a specific view for processing fields.
   *
   * @remarks
   * The 'IField' type is a generic type that takes two type parameters: 'Data' and 'Payload'. It represents a field in a form, with 'Data' representing the data type of the field value
   *, and 'Payload' representing additional payload data associated with the field.
   *
   * The 'PickProp' utility type is used to extract the 'view' property from the 'IField' type.
   *
   */
  view?: PickProp<IField<Data, Payload>, 'view'>;
}

/**
 * Interface representing a private file field.
 *
 * @template Data - The type of data associated with the file field.
 */
export interface IFileFieldPrivate<Data = IAnything> {
  onChange: PickProp<IManaged<Data>, "onChange">;
  invalid: PickProp<IManaged<Data>, "invalid">;
  incorrect: PickProp<IManaged<Data>, "incorrect">;
  value: PickProp<IManaged<Data>, "value">;
  loading: PickProp<IManaged<Data>, "loading">;
  disabled: PickProp<IManaged<Data>, "disabled">;
  dirty: PickProp<IManaged<Data>, "dirty">;
  name: PickProp<IManaged<Data>, "name">;
}

/**
 * FileField component.
 * @param props - The props object.
 * @param props.invalid - Specifies if the field is invalid.
 * @param props.value - The value of the field.
 * @param props.disabled - Specifies if the field is disabled.
 * @param props.readonly - Specifies if the field is read-only.
 * @param props.description - The description of the field.
 * @param props.outlined - Specifies if the field is outlined.
 * @param props.title - The title of the field.
 * @param props.placeholder - The placeholder text of the field.
 * @param props.incorrect - Specifies if the field has an incorrect value.
 * @param props.upload - Specifies if the field is for uploading files.
 * @param props.view - Specifies if the field is for viewing files.
 * @param props.dirty - Specifies if the field has been changed.
 * @param props.labelShrink - Specifies if the field's label should shrink.
 * @param props.loading - Specifies if the field is in a loading state.
 * @param props.onChange - The change event handler function.
 * @param props.inputRef - The ref object for the input element.
 * @param props.name - The name of the field.
 * @return - The rendered File component with the given props.
 */
export const FileField = ({
  invalid,
  value,
  disabled,
  readonly,
  description = "",
  outlined = false,
  title = "",
  placeholder = "",
  incorrect,
  upload,
  view,
  dirty,
  labelShrink,
  loading,
  onChange,
  inputRef,
  name,
}: IFileFieldProps & IFileFieldPrivate) => (
  <File
    inputRef={inputRef}
    invalid={invalid}
    incorrect={incorrect}
    value={value}
    readonly={readonly}
    disabled={disabled}
    description={description}
    outlined={outlined}
    labelShrink={labelShrink}
    title={title}
    placeholder={placeholder}
    upload={upload}
    view={view}
    dirty={dirty}
    loading={loading}
    onChange={onChange}
    name={name}
  />
);

FileField.displayName = 'FileField';

export default makeField(FileField, {
  withApplyQueue: true,
  skipDirtyClickListener: true,
  skipDebounce: true,
  skipFocusBlurCall: true,
});
