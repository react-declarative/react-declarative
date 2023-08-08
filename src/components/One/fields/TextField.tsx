import * as React from "react";

import Text from '../../../components/One/slots/TextSlot';

import makeField from "../components/makeField";

import IManaged, { PickProp } from "../../../model/IManaged";
import IAnything from "../../../model/IAnything";
import IField from "../../../model/IField";

export interface ITextFieldProps<Data = IAnything, Payload = IAnything> {
  inputType?: PickProp<IField<Data, Payload>, "inputType">;
  inputMode?: PickProp<IField<Data, Payload>, "inputMode">;
  inputPattern?: PickProp<IField<Data, Payload>, "inputPattern">;
  inputAutocomplete?: PickProp<IField<Data, Payload>, "inputAutocomplete">;
  inputFormatter?: PickProp<IField<Data, Payload>, "inputFormatter">;
  inputFormatterSymbol?: PickProp<IField<Data, Payload>, "inputFormatterSymbol">;
  inputFormatterAllowed?: PickProp<IField<Data, Payload>, "inputFormatterAllowed">;
  inputFormatterTemplate?: PickProp<IField<Data, Payload>, "inputFormatterTemplate">;
  inputFormatterReplace?: PickProp<IField<Data, Payload>, "inputFormatterReplace">;
  description?: PickProp<IField<Data, Payload>, "description">;
  outlined?: PickProp<IField<Data, Payload>, "outlined">;
  title?: PickProp<IField<Data, Payload>, "title">;
  leadingIcon?: PickProp<IField<Data, Payload>, "leadingIcon">;
  trailingIcon?: PickProp<IField<Data, Payload>, "trailingIcon">;
  leadingIconClick?: PickProp<IField<Data, Payload>, "leadingIconClick">;
  trailingIconClick?: PickProp<IField<Data, Payload>, "trailingIconClick">;
  inputRows?: PickProp<IField<Data, Payload>, "inputRows">;
  placeholder?: PickProp<IField<Data, Payload>, "placeholder">;
  readonly?: PickProp<IField<Data, Payload>, "readonly">;
  autoFocus?: PickProp<IField<Data, Payload>, "autoFocus">;
  disabled?: PickProp<IField<Data, Payload>, "disabled">;
  groupRef?: PickProp<IField<Data, Payload>, 'groupRef'>;
  inputRef?: PickProp<IField<Data, Payload>, 'inputRef'>;
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
  inputFormatterAllowed,
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
    inputFormatterAllowed={inputFormatterAllowed}
    inputFormatterTemplate={inputFormatterTemplate}
    dirty={dirty}
    loading={loading}
    onChange={onChange}
    name={name}
  />
);

TextField.displayName = 'TextField';

export default makeField(TextField, {
  withApplyQueue: true,
});
