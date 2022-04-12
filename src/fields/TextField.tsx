import * as React from "react";

import Text from '../slots/TextSlot';

import makeField from "../components/makeField";

import IManaged, { PickProp } from "../model/IManaged";
import IAnything from "../model/IAnything";
import IField from "../model/IField";

export interface ITextFieldProps<Data = IAnything> {
  inputType?: PickProp<IField<Data>, "inputType">;
  inputAutocomplete?: PickProp<IField<Data>, "inputAutocomplete">;
  inputFormatter?: PickProp<IField<Data>, "inputFormatter">;
  inputFormatterSymbol?: PickProp<IField<Data>, "inputFormatterSymbol">;
  inputFormatterTemplate?: PickProp<IField<Data>, "inputFormatterTemplate">;
  description?: PickProp<IField<Data>, "description">;
  outlined?: PickProp<IField<Data>, "outlined">;
  title?: PickProp<IField<Data>, "title">;
  leadingIcon?: PickProp<IField<Data>, "leadingIcon">;
  trailingIcon?: PickProp<IField<Data>, "trailingIcon">;
  leadingIconClick?: PickProp<IField<Data>, "leadingIconClick">;
  trailingIconClick?: PickProp<IField<Data>, "trailingIconClick">;
  inputRows?: PickProp<IField<Data>, "inputRows">;
  placeholder?: PickProp<IField<Data>, "placeholder">;
  readonly?: PickProp<IField<Data>, "readonly">;
  autoFocus?: PickProp<IField<Data>, "autoFocus">;
  disabled?: PickProp<IField<Data>, "disabled">;
  groupRef?: PickProp<IField<Data>, 'groupRef'>;
  inputRef?: PickProp<IField<Data>, 'inputRef'>;
}

export interface ITextFieldPrivate<Data = IAnything> {
  onChange: PickProp<IManaged<Data>, "onChange">;
  invalid: PickProp<IManaged<Data>, "invalid">;
  value: PickProp<IManaged<Data>, "value">;
  loading: PickProp<IManaged<Data>, "loading">;
  disabled: PickProp<IManaged<Data>, "disabled">;
  dirty: PickProp<IManaged<Data>, "dirty">;
  name: PickProp<IManaged<Data>, "name">;
}

export const TextField = ({
  invalid,
  value,
  disabled,
  readonly,
  inputType = "text",
  description = "",
  outlined = true,
  title = "",
  leadingIcon,
  trailingIcon,
  leadingIconClick,
  trailingIconClick,
  inputRows = 1,
  placeholder = "",
  inputAutocomplete = "off",
  inputFormatter,
  inputFormatterSymbol,
  inputFormatterTemplate,
  dirty,
  loading,
  onChange,
  autoFocus,
  inputRef,
  name,
}: ITextFieldProps & ITextFieldPrivate) => (
  <Text
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
    leadingIcon={leadingIcon}
    trailingIcon={trailingIcon}
    leadingIconClick={leadingIconClick}
    trailingIconClick={trailingIconClick}
    inputRows={inputRows}
    placeholder={placeholder}
    inputAutocomplete={inputAutocomplete}
    inputFormatter={inputFormatter}
    inputFormatterSymbol={inputFormatterSymbol}
    inputFormatterTemplate={inputFormatterTemplate}
    dirty={dirty}
    loading={loading}
    onChange={onChange}
    name={name}
  />
);

TextField.displayName = 'TextField';

export default makeField(TextField);
