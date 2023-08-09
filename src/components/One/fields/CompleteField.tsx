import * as React from "react";

import Complete from '../../../components/One/slots/CompleteSlot';

import makeField from "../components/makeField";

import IManaged, { PickProp } from "../../../model/IManaged";
import IAnything from "../../../model/IAnything";
import IField from "../../../model/IField";

export interface ICompleteFieldProps<Data = IAnything, Payload = IAnything> {
  inputType?: PickProp<IField<Data, Payload>, "inputType">;
  inputMode?: PickProp<IField<Data, Payload>, "inputMode">;
  inputPattern?: PickProp<IField<Data, Payload>, "inputPattern">;
  inputAutocomplete?: PickProp<IField<Data, Payload>, "inputAutocomplete">;
  description?: PickProp<IField<Data, Payload>, "description">;
  outlined?: PickProp<IField<Data, Payload>, "outlined">;
  title?: PickProp<IField<Data, Payload>, "title">;
  tip?: PickProp<IField<Data, Payload>, "tip">;
  placeholder?: PickProp<IField<Data, Payload>, "placeholder">;
  readonly?: PickProp<IField<Data, Payload>, "readonly">;
  autoFocus?: PickProp<IField<Data, Payload>, "autoFocus">;
  disabled?: PickProp<IField<Data, Payload>, "disabled">;
  groupRef?: PickProp<IField<Data, Payload>, 'groupRef'>;
  inputRef?: PickProp<IField<Data, Payload>, 'inputRef'>;
}

export interface ICompleteFieldPrivate<Data = IAnything> {
  onChange: PickProp<IManaged<Data>, "onChange">;
  invalid: PickProp<IManaged<Data>, "invalid">;
  value: PickProp<IManaged<Data>, "value">;
  loading: PickProp<IManaged<Data>, "loading">;
  disabled: PickProp<IManaged<Data>, "disabled">;
  dirty: PickProp<IManaged<Data>, "dirty">;
  name: PickProp<IManaged<Data>, "name">;
}

export const CompleteField = ({
  invalid,
  value,
  disabled,
  readonly,
  inputType = "text",
  description = "",
  outlined = true,
  title = "",
  tip,
  placeholder = "",
  inputAutocomplete = "off",
  dirty,
  loading,
  onChange,
  autoFocus,
  inputRef,
  name,
}: ICompleteFieldProps & ICompleteFieldPrivate) => (
  <Complete
    autoFocus={autoFocus}
    inputRef={inputRef}
    invalid={invalid}
    value={value}
    readonly={readonly}
    disabled={disabled}
    inputType={inputType}
    description={description}
    outlined={outlined}
    title={title}
    tip={tip}
    placeholder={placeholder}
    inputAutocomplete={inputAutocomplete}
    dirty={dirty}
    loading={loading}
    onChange={onChange}
    name={name}
  />
);

CompleteField.displayName = 'CompleteField';

export default makeField(CompleteField, {
  withApplyQueue: true,
  skipDirtyClickListener: true,
  skipFocusReadonly: true,
  skipDebounce: true,
});
