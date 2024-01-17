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
