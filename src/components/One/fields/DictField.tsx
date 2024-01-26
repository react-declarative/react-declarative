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
  description?: PickProp<IField<Data, Payload>, "description">;
  outlined?: PickProp<IField<Data, Payload>, "outlined">;
  title?: PickProp<IField<Data, Payload>, "title">;
  placeholder?: PickProp<IField<Data, Payload>, "placeholder">;
  inputAutocomplete?: PickProp<IField<Data, Payload>, "inputAutocomplete">;
  readonly?: PickProp<IField<Data, Payload>, "readonly">;
  disabled?: PickProp<IField<Data, Payload>, "disabled">;
  groupRef?: PickProp<IField<Data, Payload>, "groupRef">;
  inputRef?: PickProp<IField<Data, Payload>, "inputRef">;
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
  name,
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
  />
);

DictField.displayName = "DictField";

export default makeField(DictField, {
  withApplyQueue: false,
  skipDirtyClickListener: true,
  skipFocusReadonly: true,
  skipDebounce: true,
});
