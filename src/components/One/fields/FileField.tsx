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
  upload?: PickProp<IField<Data, Payload>, 'upload'>;
}

export interface IFileFieldPrivate<Data = IAnything> {
  onChange: PickProp<IManaged<Data>, "onChange">;
  invalid: PickProp<IManaged<Data>, "invalid">;
  value: PickProp<IManaged<Data>, "value">;
  loading: PickProp<IManaged<Data>, "loading">;
  disabled: PickProp<IManaged<Data>, "disabled">;
  dirty: PickProp<IManaged<Data>, "dirty">;
  name: PickProp<IManaged<Data>, "name">;
}

export const FileField = ({
  invalid,
  value,
  disabled,
  readonly,
  description = "",
  outlined = true,
  title = "",
  placeholder = "",
  upload,
  dirty,
  loading,
  onChange,
  inputRef,
  name,
}: IFileFieldProps & IFileFieldPrivate) => (
  <File
    inputRef={inputRef}
    invalid={invalid}
    value={value}
    readonly={readonly}
    disabled={disabled}
    description={description}
    outlined={outlined}
    title={title}
    placeholder={placeholder}
    upload={upload}
    dirty={dirty}
    loading={loading}
    onChange={onChange}
    name={name}
  />
);

FileField.displayName = 'FileField';

export default makeField(FileField, {
  skipClickListener: true,
  skipDebounce: true,
});
