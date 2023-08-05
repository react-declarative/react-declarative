import * as React from "react";

import Time from '../../../components/One/slots/TimeSlot';

import makeField from "../components/makeField";

import IField from "../../../model/IField";
import IAnything from "../../../model/IAnything";
import IManaged, { PickProp } from "../../../model/IManaged";

export interface ITimeFieldProps<Data = IAnything, Payload = IAnything> {
  title?: PickProp<IField<Data, Payload>, "title">;
  description?: PickProp<IField<Data, Payload>, "description">;
  outlined?: PickProp<IField<Data, Payload>, "outlined">;
  placeholder?: PickProp<IField<Data, Payload>, "placeholder">;
  readonly?: PickProp<IField<Data, Payload>, "readonly">;
  autoFocus?: PickProp<IField<Data, Payload>, "autoFocus">;
  disabled?: PickProp<IField<Data, Payload>, "disabled">;
  inputRef?: PickProp<IField<Data, Payload>, "inputRef">;
}

export interface ITimeFieldPrivate<Data = IAnything> {
  onChange: PickProp<IManaged<Data>, "onChange">;
  invalid: PickProp<IManaged<Data>, "invalid">;
  value: PickProp<IManaged<Data>, "value">;
  disabled: PickProp<IManaged<Data>, "disabled">;
  dirty: PickProp<IManaged<Data>, "dirty">;
  name: PickProp<IManaged<Data>, "name">;
}

export const TimeField = ({
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
}: ITimeFieldPrivate & ITimeFieldProps) => (
  <Time
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

TimeField.displayName = 'TimeField';

export default makeField(TimeField, {
  withApplyQueue: true,
  skipDebounce: true,
  skipDirtyClickListener: true,
});
