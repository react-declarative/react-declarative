import * as React from "react";

import Complete from "../../../components/One/slots/CompleteSlot";

import makeField from "../components/makeField";

import IManaged, { PickProp } from "../../../model/IManaged";
import IAnything from "../../../model/IAnything";
import IField from "../../../model/IField";

/**
 * Interface for specifying the props of a complete field.
 * @template Data, Payload - The types of data and payload.
 */
export interface ICompleteFieldProps<Data = IAnything, Payload = IAnything> {
  inputType?: PickProp<IField<Data, Payload>, "inputType">;
  inputMode?: PickProp<IField<Data, Payload>, "inputMode">;
  inputPattern?: PickProp<IField<Data, Payload>, "inputPattern">;
  inputAutocomplete?: PickProp<IField<Data, Payload>, "inputAutocomplete">;
  description?: PickProp<IField<Data, Payload>, "description">;
  labelShrink?: PickProp<IField<Data>, "labelShrink">;
  keepRaw?: PickProp<IField<Data, Payload>, "keepRaw">;
  outlined?: PickProp<IField<Data, Payload>, "outlined">;
  title?: PickProp<IField<Data, Payload>, "title">;
  tip?: PickProp<IField<Data, Payload>, "tip">;
  tipSelect?: PickProp<IField<Data, Payload>, "tipSelect">;
  placeholder?: PickProp<IField<Data, Payload>, "placeholder">;
  readonly?: PickProp<IField<Data, Payload>, "readonly">;
  autoFocus?: PickProp<IField<Data, Payload>, "autoFocus">;
  disabled?: PickProp<IField<Data, Payload>, "disabled">;
  groupRef?: PickProp<IField<Data, Payload>, "groupRef">;
  inputRef?: PickProp<IField<Data, Payload>, "inputRef">;
  inputFormatter?: PickProp<IField<Data, Payload>, "inputFormatter">;
  inputFormatterSymbol?: PickProp<
    IField<Data, Payload>,
    "inputFormatterSymbol"
  >;
  inputFormatterAllowed?: PickProp<
    IField<Data, Payload>,
    "inputFormatterAllowed"
  >;
  inputFormatterTemplate?: PickProp<
    IField<Data, Payload>,
    "inputFormatterTemplate"
  >;
  inputFormatterReplace?: PickProp<
    IField<Data, Payload>,
    "inputFormatterReplace"
  >;
}

/**
 * Represents a private interface for a complete field.
 *
 * @template Data - The type of the field's data.
 */
export interface ICompleteFieldPrivate<Data = IAnything> {
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
 * A wrapper component for the Complete component.
 *
 * @param props - The props for the CompleteField component.
 * @param props.invalid - Determines whether the field is in an invalid state.
 * @param props.incorrect - Determines whether the field has incorrect data.
 * @param props.value - The current value of the field.
 * @param props.disabled - Determines whether the field is disabled.
 * @param props.readonly - Determines whether the field is read-only.
 * @param props.inputType - The type of the input field.
 * @param props.description - The description of the field.
 * @param props.outlined - Determines whether the field is outlined.
 * @param props.keepRaw - Determines whether the raw value should be kept.
 * @param props.title - The title of the field.
 * @param props.labelShrink - The label shrink value.
 * @param props.tip - The tip for the field.
 * @param props.tipSelect - The tip for the select field.
 * @param props.placeholder - The placeholder text for the input field.
 * @param props.inputAutocomplete - The autocomplete attribute for the input field.
 * @param props.dirty - The dirty value of the field.
 * @param props.loading - Determines whether the field is in a loading state.
 * @param props.onChange - The callback function for the field value change event.
 * @param props.autoFocus - Determines whether the field should be auto-focused.
 * @param props.inputRef - The reference to the input field.
 * @param props.name - The name of the field.
 * @param props.inputFormatter - The input formatter for the field.
 * @param props.inputFormatterAllowed - The allowed values for the input formatter.
 * @param props.inputFormatterReplace - The values to replace in the input formatter.
 * @param props.inputFormatterSymbol - The symbol for the input formatter.
 * @param props.inputFormatterTemplate - The template for the input formatter.
 * @param props.withContextMenu - Determines whether the field should have a context menu.
 * @returns The rendered CompleteField component.
 */
export const CompleteField = ({
  invalid,
  incorrect,
  value,
  disabled,
  readonly,
  inputType = "text",
  description = "",
  outlined = false,
  keepRaw = false,
  title = "",
  labelShrink,
  tip,
  tipSelect,
  placeholder = "",
  inputAutocomplete = "off",
  dirty,
  loading,
  onChange,
  autoFocus,
  inputRef,
  name,
  inputFormatter,
  inputFormatterAllowed,
  inputFormatterReplace,
  inputFormatterSymbol,
  inputFormatterTemplate,
  withContextMenu,
}: ICompleteFieldProps & ICompleteFieldPrivate) => (
  <Complete
    autoFocus={autoFocus}
    inputRef={inputRef}
    invalid={invalid}
    incorrect={incorrect}
    value={value}
    readonly={readonly}
    disabled={disabled}
    inputType={inputType}
    description={description}
    withContextMenu={withContextMenu}
    outlined={outlined}
    keepRaw={keepRaw}
    labelShrink={labelShrink}
    title={title}
    tip={tip}
    tipSelect={tipSelect}
    placeholder={placeholder}
    inputAutocomplete={inputAutocomplete}
    dirty={dirty}
    loading={loading}
    onChange={onChange}
    name={name}
    inputFormatter={inputFormatter}
    inputFormatterAllowed={inputFormatterAllowed}
    inputFormatterReplace={inputFormatterReplace}
    inputFormatterSymbol={inputFormatterSymbol}
    inputFormatterTemplate={inputFormatterTemplate}
  />
);

CompleteField.displayName = "CompleteField";

export default makeField(CompleteField);
