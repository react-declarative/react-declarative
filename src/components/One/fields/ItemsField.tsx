import * as React from "react";

import Items from '../../../components/One/slots/ItemsSlot';

import makeField from "../components/makeField";

import IManaged, { PickProp } from "../../../model/IManaged";
import IAnything from "../../../model/IAnything";
import IField from "../../../model/IField";

export interface IItemsFieldProps<Data = IAnything, Payload = IAnything> {
  description?: PickProp<IField<Data, Payload>, "description">;
  placeholder?: PickProp<IField<Data, Payload>, "placeholder">;
  outlined?: PickProp<IField<Data, Payload>, "outlined">;
  itemList?: PickProp<IField<Data, Payload>, "itemList">;
  keepSync?: PickProp<IField<Data, Payload>, "keepSync">;
  readonly?: PickProp<IField<Data, Payload>, "readonly">;
  disabled?: PickProp<IField<Data, Payload>, "disabled">;
  shouldUpdateItemList?: PickProp<IField<Data, Payload>, "shouldUpdateItemList">;
  title?: PickProp<IField<Data, Payload>, "title">;
  tr?: PickProp<IField<Data, Payload>, "tr">;
  groupRef?: PickProp<IField<Data, Payload>, 'groupRef'>;
}

export interface IItemsFieldPrivate<Data = IAnything> {
  onChange: PickProp<IManaged<Data>, "onChange">;
  value: PickProp<IManaged<Data>, 'value'>;
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
  keepSync,
  dirty,
  invalid,
  title,
  shouldUpdateItemList,
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
    shouldUpdateItemList={shouldUpdateItemList}
    keepSync={keepSync}
    dirty={dirty}
    invalid={invalid}
    title={title}
    tr={tr}
    onChange={onChange}
  />
);

ItemsField.displayName = 'ItemsField';

export default makeField(ItemsField, {
  withApplyQueue: true,
  skipDebounce: true,
  skipDirtyClickListener: true,
  skipFocusReadonly: true,
});
