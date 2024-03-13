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
  labelShrink?: PickProp<IField<Data>, "labelShrink">;
  autoFocus?: PickProp<IField<Data, Payload>, "autoFocus">;
  disabled?: PickProp<IField<Data, Payload>, "disabled">;
  inputRef?: PickProp<IField<Data, Payload>, "inputRef">;
}

export interface IDateFieldPrivate<Data = IAnything> {
  onChange: PickProp<IManaged<Data>, "onChange">;
  invalid: PickProp<IManaged<Data>, "invalid">;
  incorrect: PickProp<IManaged<Data>, "incorrect">;
  value: PickProp<IManaged<Data>, "value">;
  disabled: PickProp<IManaged<Data>, "disabled">;
  dirty: PickProp<IManaged<Data>, "dirty">;
  name: PickProp<IManaged<Data>, "name">;
  withContextMenu: PickProp<IManaged<Data>, "withContextMenu">;
}

/**
 * Represents a DateField component.
 *
 * @typedef {Object} DateField
 * @param invalid - Specifies whether the date field is invalid.
 * @param incorrect - Specifies whether the date field has an incorrect value.
 * @param value - The value of the date field.
 * @param disabled - Specifies whether the date field is disabled.
 * @param readonly - Specifies whether the date field is readonly.
 * @param description - The description of the date field.
 * @param outlined - Specifies whether the date field is outlined.
 * @param title - The title of the date field.
 * @param placeholder - The placeholder of the date field.
 * @param labelShrink - Specifies whether the label should shrink when the date field value is not empty.
 * @param dirty - Specifies whether the date field has been modified.
 * @param autoFocus - Specifies whether the date field should automatically receive focus.
 * @param inputRef - A ref for the date field input element.
 * @param onChange - The event handler for when the value of the date field changes.
 * @param withContextMenu - Specifies whether the date field should have a context menu.
 * @param name - The name of the date field.
 * @return - The Date component with the specified props.
 */
export const DateField = ({
  invalid,
  incorrect,
  value,
  disabled,
  readonly,
  description = "",
  outlined = false,
  title = "",
  placeholder = title,
  labelShrink,
  dirty,
  autoFocus,
  inputRef,
  onChange,
  withContextMenu,
  name,
}: IDateFieldPrivate & IDateFieldProps) => (
  <Date
    autoFocus={autoFocus}
    inputRef={inputRef}
    invalid={invalid}
    incorrect={incorrect}
    value={value}
    readonly={readonly}
    disabled={disabled}
    description={description}
    outlined={outlined}
    labelShrink={labelShrink}
    title={title}
    placeholder={placeholder}
    withContextMenu={withContextMenu}
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
