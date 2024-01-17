import * as React from "react";

import Combo from "../../../components/One/slots/ComboSlot";

import makeField from "../components/makeField";

import IManaged, { PickProp } from "../../../model/IManaged";
import IAnything from "../../../model/IAnything";
import IField from "../../../model/IField";

export interface IComboFieldProps<Data = IAnything, Payload = IAnything> {
  description?: PickProp<IField<Data, Payload>, "description">;
  placeholder?: PickProp<IField<Data, Payload>, "placeholder">;
  outlined?: PickProp<IField<Data, Payload>, "outlined">;
  itemList?: PickProp<IField<Data, Payload>, "itemList">;
  freeSolo?: PickProp<IField<Data, Payload>, "freeSolo">;
  noDeselect?: PickProp<IField<Data, Payload>, "noDeselect">;
  virtualListBox?: PickProp<IField<Data, Payload>, "virtualListBox">;
  watchItemList?: PickProp<IField<Data, Payload>, "watchItemList">;
  readonly?: PickProp<IField<Data, Payload>, "readonly">;
  disabled?: PickProp<IField<Data, Payload>, "disabled">;
  labelShrink?: PickProp<IField<Data>, "labelShrink">;
  title?: PickProp<IField<Data, Payload>, "title">;
  tr?: PickProp<IField<Data, Payload>, "tr">;
  groupRef?: PickProp<IField<Data, Payload>, 'groupRef'>;
}

export interface IComboFieldPrivate<Data = IAnything>  {
  value: PickProp<IManaged<Data>, "value">;
  readonly: PickProp<IManaged<Data>, "readonly">;
  onChange: PickProp<IManaged<Data>, "onChange">;
  dirty: PickProp<IManaged<Data>, "dirty">;
  invalid: PickProp<IManaged<Data>, "invalid">;
  incorrect: PickProp<IManaged<Data>, "incorrect">;
}

export const ComboField = ({
  value,
  disabled,
  readonly,
  description = "",
  placeholder = "",
  outlined = false,
  itemList = [],
  freeSolo = false,
  virtualListBox = true,
  watchItemList,
  noDeselect,
  labelShrink,
  title = "",
  dirty,
  invalid,
  incorrect,
  tr = (s) => s.toString(),
  onChange,
}: IComboFieldProps & IComboFieldPrivate) => (
  <Combo
    value={value}
    disabled={disabled}
    readonly={readonly}
    description={description}
    placeholder={placeholder}
    outlined={outlined}
    itemList={itemList}
    noDeselect={noDeselect}
    virtualListBox={virtualListBox}
    watchItemList={watchItemList}
    labelShrink={labelShrink}
    freeSolo={freeSolo}
    title={title}
    dirty={dirty}
    invalid={invalid}
    incorrect={incorrect}
    tr={tr}
    onChange={onChange}
  />
);

ComboField.displayName = "ComboField";

export default makeField(ComboField, {
  withApplyQueue: true,
  skipDebounce: true,
  skipDirtyClickListener: true,
  skipFocusReadonly: true,
});
