import * as React from "react";

import Complete from "../../../components/One/slots/CompleteSlot";

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
