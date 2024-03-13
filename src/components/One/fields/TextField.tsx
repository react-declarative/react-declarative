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
  leadingIconRipple?: PickProp<IField<Data, Payload>, 'leadingIconRipple'>;
  trailingIconRipple?: PickProp<IField<Data, Payload>, 'trailingIconRipple'>;
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
  labelShrink?: PickProp<IField<Data, Payload>, 'labelShrink'>;
}

export interface ITextFieldPrivate<Data = IAnything> {
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
 * TextField component
 *
 * @typedef {Object} TextField
 * @param invalid - Indicates if the input value is invalid
 * @param incorrect - Indicates if the input value is incorrect
 * @param value - The current value of the input field
 * @param disabled - Indicates if the input field is disabled
 * @param readonly - Indicates if the input field is read-only
 * @param inputType - The type of input field (default: "text")
 * @param description - The description or helper text for the input field
 * @param outlined - Indicates if the input field is outlined
 * @param labelShrink - Indicates if the label should shrink when focused
 * @param title - The title or tooltip for the input field
 * @param leadingIconRipple - Indicates if clicking the leading icon should trigger a ripple effect
 * @param trailingIconRipple - Indicates if clicking the trailing icon should trigger a ripple effect
 * @param leadingIcon - The icon component to display at the start of the input field
 * @param trailingIcon - The icon component to display at the end of the input field
 * @param leadingIconClick - The function to call when the leading icon is clicked
 * @param trailingIconClick - The function to call when the trailing icon is clicked
 * @param inputRows - The number of rows for a textarea input field (default: 1)
 * @param placeholder - The placeholder text for the input field
 * @param inputAutocomplete - The autocomplete behavior for the input field (default: "off")
 * @param inputFormatter - A function used to format the input value
 * @param inputFormatterSymbol - The symbol or character used in the input formatter
 * @param inputFormatterAllowed - The list of allowed characters in the input formatter
 * @param inputFormatterTemplate - A template string used in the input formatter
 * @param dirty - Indicates if the input value has been modified
 * @param loading - Indicates if the input field is in a loading state
 * @param onChange - The function to call when the input value changes
 * @param autoFocus - Indicates if the input field should be automatically focused
 * @param inputRef - The reference to the input element
 * @param name - The name of the input field
 * @returns - The TextField component
 */
export const TextField = ({
  invalid,
  incorrect,
  value,
  disabled,
  readonly,
  inputType = "text",
  description = "",
  outlined = false,
  labelShrink,
  title = "",
  leadingIconRipple,
  trailingIconRipple,
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
    incorrect={incorrect}
    value={value}
    readonly={readonly}
    disabled={disabled}
    inputType={inputType}
    description={description}
    outlined={outlined}
    title={title}
    leadingIconRipple={leadingIconRipple}
    trailingIconRipple={trailingIconRipple}
    leadingIcon={leadingIcon}
    trailingIcon={trailingIcon}
    labelShrink={labelShrink}
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

export default makeField(TextField);
