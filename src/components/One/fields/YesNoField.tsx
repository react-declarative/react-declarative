import * as React from "react";

import YesNo from "../../../components/One/slots/YesNoSlot";

import makeField from "../components/makeField";

import IManaged, { PickProp } from "../../../model/IManaged";
import IAnything from "../../../model/IAnything";
import IField from "../../../model/IField";

export interface IYesNoFieldProps<Data = IAnything, Payload = IAnything> {
  description?: PickProp<IField<Data, Payload>, "description">;
  placeholder?: PickProp<IField<Data, Payload>, "placeholder">;
  outlined?: PickProp<IField<Data, Payload>, "outlined">;
  noDeselect?: PickProp<IField<Data, Payload>, "noDeselect">;
  virtualListBox?: PickProp<IField<Data, Payload>, "virtualListBox">;
  tr?: PickProp<IField<Data, Payload>, "tr">;
  readonly?: PickProp<IField<Data, Payload>, "readonly">;
  disabled?: PickProp<IField<Data, Payload>, "disabled">;
  labelShrink?: PickProp<IField<Data>, "labelShrink">;
  title?: PickProp<IField<Data, Payload>, "title">;
  groupRef?: PickProp<IField<Data, Payload>, 'groupRef'>;
}

export interface IYesNoFieldPrivate<Data = IAnything>  {
  value: PickProp<IManaged<Data>, "value">;
  readonly: PickProp<IManaged<Data>, "readonly">;
  onChange: PickProp<IManaged<Data>, "onChange">;
  dirty: PickProp<IManaged<Data>, "dirty">;
  invalid: PickProp<IManaged<Data>, "invalid">;
  incorrect: PickProp<IManaged<Data>, "incorrect">;
}

/**
 * Represents a Yes/No field component.
 *
 * @param props - The properties of the Yes/No field component.
 * @param props.value - The current value of the field.
 * @param props.disabled - Determines if the field is disabled.
 * @param props.readonly - Determines if the field is read-only.
 * @param props.description - The description or tooltip text for the field.
 * @param props.placeholder - The text to display when the field is empty.
 * @param props.outlined - Determines if the field is outlined.
 * @param props.virtualListBox - Determines if the field uses a virtual list box.
 * @param props.noDeselect - Determines if the field allows deselecting the value.
 * @param props.labelShrink - Determines if the label should shrink when the field has a value.
 * @param props.title - The title attribute of the field.
 * @param props.tr - The translate map function
 * @param props.dirty - Determines if the field has been modified.
 * @param props.invalid - Determines if the field is in an invalid state.
 * @param props.incorrect - Determines if the field has an incorrect value.
 * @param props.onChange - The function to call when the field's value changes.
 *
 * @returns - The Yes/No field component.
 */
export const YesNoField = ({
  value,
  disabled,
  readonly,
  description = "",
  placeholder = "",
  outlined = false,
  virtualListBox = true,
  noDeselect,
  labelShrink,
  title = "",
  tr,
  dirty,
  invalid,
  incorrect,
  onChange,
}: IYesNoFieldProps & IYesNoFieldPrivate) => (
  <YesNo
    value={value}
    disabled={disabled}
    readonly={readonly}
    description={description}
    placeholder={placeholder}
    outlined={outlined}
    noDeselect={noDeselect}
    virtualListBox={virtualListBox}
    labelShrink={labelShrink}
    tr={tr}
    title={title}
    dirty={dirty}
    invalid={invalid}
    incorrect={incorrect}
    onChange={onChange}
  />
);

YesNoField.displayName = "YesNoField";

export default makeField(YesNoField, {
  withApplyQueue: true,
  skipDebounce: true,
  skipDirtyClickListener: true,
  skipFocusReadonly: true,
});
