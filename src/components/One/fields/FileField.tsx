import * as React from "react";

import File from '../../../components/One/slots/FileSlot';

import makeField from "../components/makeField";

import IManaged, { PickProp } from "../../../model/IManaged";
import IAnything from "../../../model/IAnything";
import IField from "../../../model/IField";

export interface IFileFieldProps<Data = IAnything, Payload = IAnything> {
  description?: PickProp<IField<Data, Payload>, "description">;
  outlined?: PickProp<IField<Data, Payload>, "outlined">;
  title?: PickProp<IField<Data, Payload>, "title">;
  placeholder?: PickProp<IField<Data, Payload>, "placeholder">;
  fileAccept?: PickProp<IField<Data, Payload>, 'fileAccept'>;
  readonly?: PickProp<IField<Data, Payload>, "readonly">;
  disabled?: PickProp<IField<Data, Payload>, "disabled">;
  groupRef?: PickProp<IField<Data, Payload>, 'groupRef'>;
  inputRef?: PickProp<IField<Data, Payload>, 'inputRef'>;
  labelShrink?: PickProp<IField<Data>, "labelShrink">;
  upload?: PickProp<IField<Data, Payload>, 'upload'>;
  view?: PickProp<IField<Data, Payload>, 'view'>;
}

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
});
