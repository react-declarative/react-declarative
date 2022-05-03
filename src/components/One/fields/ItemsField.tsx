import * as React from "react";

import Items from '../../../components/One/slots/ItemsSlot';

import makeField from "../components/makeField";

import IManaged, { PickProp } from "../../../model/IManaged";
import IAnything from "../../../model/IAnything";
import IField from "../../../model/IField";

export interface IItemsFieldProps<Data = IAnything> {
  description?: PickProp<IField<Data>, "description">;
  placeholder?: PickProp<IField<Data>, "placeholder">;
  outlined?: PickProp<IField<Data>, "outlined">;
  itemList?: PickProp<IField<Data>, "itemList">;
  title?: PickProp<IField<Data>, "title">;
  tr?: PickProp<IField<Data>, "tr">;
  groupRef?: PickProp<IField<Data>, 'groupRef'>;
}

export interface IItemsFieldPrivate<Data = IAnything> {
  onChange: PickProp<IManaged<Data>, "onChange">;
  value: PickProp<IManaged<Data>, 'value'>;
  disabled: PickProp<IManaged<Data>, "disabled">;
  readonly: PickProp<IManaged<Data>, "readonly">;
  dirty: PickProp<IManaged<Data>, "dirty">;
  invalid: PickProp<IManaged<Data>, "invalid">;
}

export const ItemsField = ({
  value,
  disabled,
  readonly,
  description,
  placeholder,
  outlined = true,
  itemList = [],
  dirty,
  invalid,
  title,
  tr = (s) => s.toString(),
  onChange,
}: IItemsFieldProps & IItemsFieldPrivate) => (
  <Items
    value={value}
    disabled={disabled}
    readonly={readonly}
    description={description}
    placeholder={placeholder}
    outlined={outlined}
    itemList={itemList}
    dirty={dirty}
    invalid={invalid}
    title={title}
    tr={tr}
    onChange={onChange}
  />
);

ItemsField.displayName = 'ItemsField';

export default makeField(ItemsField, {
  skipDebounce: true,
});
