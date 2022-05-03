import * as React from "react";

import Combo from "../../../components/One/slots/ComboSlot";

import makeField from "../components/makeField";

import IManaged, { PickProp } from "../../../model/IManaged";
import IAnything from "../../../model/IAnything";
import IField from "../../../model/IField";

export interface IComboFieldProps<Data = IAnything> {
  description?: PickProp<IField<Data>, "description">;
  placeholder?: PickProp<IField<Data>, "placeholder">;
  outlined?: PickProp<IField<Data>, "outlined">;
  itemList?: PickProp<IField<Data>, "itemList">;
  title?: PickProp<IField<Data>, "title">;
  tr?: PickProp<IField<Data>, "tr">;
  groupRef?: PickProp<IField<Data>, 'groupRef'>;
}

export interface IComboFieldPrivate<Data = IAnything>  {
  value: PickProp<IManaged<Data>, "value">;
  disabled: PickProp<IManaged<Data>, "disabled">;
  readonly: PickProp<IManaged<Data>, "readonly">;
  onChange: PickProp<IManaged<Data>, "onChange">;
  dirty: PickProp<IManaged<Data>, "dirty">;
  invalid: PickProp<IManaged<Data>, "invalid">;
}

export const ComboField = ({
  value,
  disabled,
  readonly,
  description = "",
  placeholder = "",
  outlined = true,
  itemList = [],
  title = "",
  dirty,
  invalid,
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
    title={title}
    dirty={dirty}
    invalid={invalid}
    tr={tr}
    onChange={onChange}
  />
);

ComboField.displayName = "ComboField";

export default makeField(ComboField, {
  skipDebounce: true,
});
