import * as React from "react";

import Dict from "../../../components/One/slots/DictSlot";

import makeField from "../components/makeField";

import IManaged, { PickProp } from "../../../model/IManaged";
import IAnything from "../../../model/IAnything";
import IField from "../../../model/IField";

export interface IDictFieldProps<Data = IAnything, Payload = IAnything> {
  dictLimit?: PickProp<IField<Data, Payload>, "dictLimit">;
  dictDelay?: PickProp<IField<Data, Payload>, "dictDelay">;
  dictSearch?: PickProp<IField<Data, Payload>, "dictSearch">;
  dictOnAppend?: PickProp<IField<Data, Payload>, "dictOnAppend">;
  dictOnText?: PickProp<IField<Data, Payload>, "dictOnText">;
  dictOnItem?: PickProp<IField<Data, Payload>, "dictOnItem">;
  dictValue?: PickProp<IField<Data, Payload>, "dictValue">;
  dictSearchText?: PickProp<IField<Data, Payload>, "dictSearchText">;
  dictSearchItem?: PickProp<IField<Data, Payload>, "dictSearchItem">;
  dictCreateButton?: PickProp<IField<Data, Payload>, "dictCreateButton">;
  inputType?: PickProp<IField<Data, Payload>, "inputType">;
  inputMode?: PickProp<IField<Data, Payload>, "inputMode">;
  inputPattern?: PickProp<IField<Data, Payload>, "inputPattern">;
  inputAutocomplete?: PickProp<IField<Data, Payload>, "inputAutocomplete">;
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
  description?: PickProp<IField<Data, Payload>, "description">;
  outlined?: PickProp<IField<Data, Payload>, "outlined">;
  title?: PickProp<IField<Data, Payload>, "title">;
  placeholder?: PickProp<IField<Data, Payload>, "placeholder">;
  readonly?: PickProp<IField<Data, Payload>, "readonly">;
  disabled?: PickProp<IField<Data, Payload>, "disabled">;
  groupRef?: PickProp<IField<Data, Payload>, "groupRef">;
  inputRef?: PickProp<IField<Data, Payload>, "inputRef">;
  leadingIconRipple?: PickProp<IField<Data, Payload>, 'leadingIconRipple'>;
  trailingIconRipple?: PickProp<IField<Data, Payload>, 'trailingIconRipple'>;
  leadingIcon?: PickProp<IField<Data, Payload>, 'leadingIcon'>;
  trailingIcon?: PickProp<IField<Data, Payload>, 'trailingIcon'>;
  leadingIconClick?: PickProp<IField<Data, Payload>, 'leadingIconClick'>;
  trailingIconClick?: PickProp<IField<Data, Payload>, 'trailingIconClick'>;
}

export interface IDictFieldPrivate<Data = IAnything> {
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
 * A component for rendering a DictField.
 *
 * @param DictFieldProps - The props for the DictField component.
 * @param DictFieldProps.invalid - Indicates whether the field is invalid.
 * @param DictFieldProps.incorrect - Indicates whether the field is incorrect.
 * @param DictFieldProps.value - The value of the field.
 * @param DictFieldProps.disabled - Indicates whether the field is disabled.
 * @param DictFieldProps.readonly - Indicates whether the field is readonly.
 * @param DictFieldProps.inputType - The type of the input.
 * @param DictFieldProps.inputAutocomplete - The autocomplete mode for the input.
 * @param DictFieldProps.description - The description for the field.
 * @param DictFieldProps.outlined - Indicates whether the field is outlined.
 * @param DictFieldProps.title - The title for the field.
 * @param DictFieldProps.placeholder - The placeholder text for the field.
 * @param DictFieldProps.dirty - Indicates whether the field has been modified.
 * @param DictFieldProps.loading - Indicates whether the field is loading.
 * @param DictFieldProps.onChange - The event handler for field value change.
 * @param DictFieldProps.dictLimit - The limit of the dictionary items.
 * @param DictFieldProps.dictDelay - The delay for dictionary search.
 * @param DictFieldProps.dictSearch - The search query for the dictionary.
 * @param DictFieldProps.dictOnAppend - The event handler for dictionary item append.
 * @param DictFieldProps.dictOnText - The event handler for dictionary text change.
 * @param DictFieldProps.dictOnItem - The event handler for dictionary item selection.
 * @param DictFieldProps.dictValue - The dictionary item value.
 * @param DictFieldProps.dictSearchText - The search query for dictionary text.
 * @param DictFieldProps.dictSearchItem - The dictionary item for search.
 * @param DictFieldProps.dictCreateButton - Indicates whether to provide a create button for dictionary items.
 * @param DictFieldProps.inputMode - The input mode for the field.
 * @param DictFieldProps.inputPattern - The input pattern for the field.
 * @param DictFieldProps.groupRef - The reference to the group containing the field.
 * @param DictFieldProps.inputRef - The reference to the input field.
 * @param DictFieldProps.inputFormatter - The input formatter function.
 * @param DictFieldProps.inputFormatterAllowed - The allowed characters for input formatting.
 * @param DictFieldProps.inputFormatterReplace - The replacement text for input formatting.
 * @param DictFieldProps.inputFormatterSymbol - The symbol used for input formatting.
 * @param DictFieldProps.inputFormatterTemplate - The template for input formatting.
 * @param DictFieldProps.name - The name of the field.
 * @param DictFieldProps.leadingIcon - The leading icon for the field.
 * @param DictFieldProps.trailingIcon - The trailing icon for the field.
 * @param DictFieldProps.leadingIconClick - The event handler for click on the leading icon.
 * @param DictFieldProps.trailingIconClick - The event handler for click on the trailing icon.
 * @param DictFieldProps.leadingIconRipple - Indicates whether the leading icon should have ripple effect.
 * @param DictFieldProps.trailingIconRipple - Indicates whether the trailing icon should have ripple effect.
 *
 * @return - The rendered DictField component.
 */
export const DictField = ({
  invalid,
  incorrect,
  value,
  disabled,
  readonly,
  inputType = "text",
  inputAutocomplete,
  description = "",
  outlined = false,
  title = "",
  placeholder = "",
  dirty,
  loading,
  onChange,
  dictLimit,
  dictDelay,
  dictSearch,
  dictOnAppend,
  dictOnText,
  dictOnItem,
  dictValue,
  dictSearchText,
  dictSearchItem,
  dictCreateButton,
  inputMode,
  inputPattern,
  groupRef,
  inputRef,
  inputFormatter,
  inputFormatterAllowed,
  inputFormatterReplace,
  inputFormatterSymbol,
  inputFormatterTemplate,
  name,
  leadingIcon,
  trailingIcon,
  leadingIconClick,
  trailingIconClick,
  leadingIconRipple,
  trailingIconRipple,
}: IDictFieldProps & IDictFieldPrivate) => (
  <Dict
    inputRef={inputRef}
    groupRef={groupRef}
    invalid={invalid}
    incorrect={incorrect}
    value={value}
    readonly={readonly}
    disabled={disabled}
    inputType={inputType}
    description={description}
    inputAutocomplete={inputAutocomplete}
    outlined={outlined}
    title={title}
    placeholder={placeholder}
    dirty={dirty}
    loading={loading}
    dictLimit={dictLimit}
    dictDelay={dictDelay}
    dictSearch={dictSearch}
    dictOnAppend={dictOnAppend}
    dictOnText={dictOnText}
    dictOnItem={dictOnItem}
    dictValue={dictValue}
    dictSearchText={dictSearchText}
    dictSearchItem={dictSearchItem}
    dictCreateButton={dictCreateButton}
    inputMode={inputMode}
    inputPattern={inputPattern}
    onChange={onChange}
    name={name}
    inputFormatter={inputFormatter}
    inputFormatterAllowed={inputFormatterAllowed}
    inputFormatterReplace={inputFormatterReplace}
    inputFormatterSymbol={inputFormatterSymbol}
    inputFormatterTemplate={inputFormatterTemplate}
    leadingIcon={leadingIcon}
    trailingIcon={trailingIcon}
    leadingIconClick={leadingIconClick}
    trailingIconClick={trailingIconClick}
    leadingIconRipple={leadingIconRipple}
    trailingIconRipple={trailingIconRipple}
  />
);

DictField.displayName = "DictField";

export default makeField(DictField, {
  withApplyQueue: false,
  skipDirtyClickListener: true,
  skipFocusReadonly: true,
  skipDebounce: true,
});
