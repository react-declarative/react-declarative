import * as React from "react";

import Date from '../../../components/One/slots/DateSlot';

import makeField from "../components/makeField";

import IField from "../../../model/IField";
import IAnything from "../../../model/IAnything";
import IManaged, { PickProp } from "../../../model/IManaged";

export interface IDateFieldProps<Data = IAnything, Payload = IAnything> {
  title?: PickProp<IField<Data, Payload>, "title">;
  description?: PickProp<IField<Data, Payload>, "description">;
  outlined?: PickProp<IField<Data, Payload>, "outlined">;
  placeholder?: PickProp<IField<Data, Payload>, "placeholder">;
  readonly?: PickProp<IField<Data, Payload>, "readonly">;
  autoFocus?: PickProp<IField<Data, Payload>, "autoFocus">;
  disabled?: PickProp<IField<Data, Payload>, "disabled">;
  inputRef?: PickProp<IField<Data, Payload>, "inputRef">;
}

export interface IDateFieldPrivate<Data = IAnything> {
  onChange: PickProp<IManaged<Data>, "onChange">;
  invalid: PickProp<IManaged<Data>, "invalid">;
  value: PickProp<IManaged<Data>, "value">;
  disabled: PickProp<IManaged<Data>, "disabled">;
  dirty: PickProp<IManaged<Data>, "dirty">;
  name: PickProp<IManaged<Data>, "name">;
}

export const DateField = ({
  invalid,
  value,
  disabled,
  readonly,
  description = "",
  outlined = true,
  title = "Text",
  placeholder = title,
  dirty,
  autoFocus,
  inputRef,
  onChange,
  name,
}: IDateFieldPrivate & IDateFieldProps) => (
  <Date
    autoFocus={autoFocus}
    inputRef={inputRef}
    invalid={invalid}
    value={value}
    readonly={readonly}
    disabled={disabled}
    description={description}
    outlined={outlined}
    title={title}
    placeholder={placeholder}
    dirty={dirty}
    onChange={onChange}
    name={name}
  />
);

DateField.displayName = 'DateField';

export default makeField(DateField, {
  withApplyQueue: true,
  skipDebounce: true,
  skipDirtyClickListener: true,
});
