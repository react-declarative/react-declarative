import * as React from "react";

import Items from '../../../components/One/slots/ItemsSlot';

import makeField from "../components/makeField";

import IManaged, { PickProp } from "../../../model/IManaged";
import IAnything from "../../../model/IAnything";
import IField from "../../../model/IField";

/**
 * Props for the IItemsField component.
 *
 * @template Data - The type of data for the field.
 * @template Payload - The type of payload for the field.
 */
export interface IItemsFieldProps<Data = IAnything, Payload = IAnything> {
  description?: PickProp<IField<Data, Payload>, "description">;
  placeholder?: PickProp<IField<Data, Payload>, "placeholder">;
  outlined?: PickProp<IField<Data, Payload>, "outlined">;
  itemList?: PickProp<IField<Data, Payload>, "itemList">;
  freeSolo?: PickProp<IField<Data, Payload>, "freeSolo">;
  virtualListBox?: PickProp<IField<Data, Payload>, "virtualListBox">;
  readonly?: PickProp<IField<Data, Payload>, "readonly">;
  disabled?: PickProp<IField<Data, Payload>, "disabled">;
  noDeselect?: PickProp<IField<Data, Payload>, "noDeselect">;
  title?: PickProp<IField<Data, Payload>, "title">;
  tr?: PickProp<IField<Data, Payload>, "tr">;
  groupRef?: PickProp<IField<Data, Payload>, 'groupRef'>;
  labelShrink?: PickProp<IField<Data>, "labelShrink">;
  watchItemList?: PickProp<IField<Data>, "watchItemList">;
}

/**
 * Represents a private interface for an items field.
 *
 * @interface IItemsFieldPrivate
 * @template Data The type of data managed by the items field.
 */
export interface IItemsFieldPrivate<Data = IAnything> {
  onChange: PickProp<IManaged<Data>, "onChange">;
  value: PickProp<IManaged<Data>, 'value'>;
  dirty: PickProp<IManaged<Data>, "dirty">;
  invalid: PickProp<IManaged<Data>, "invalid">;
  incorrect: PickProp<IManaged<Data>, "incorrect">;
  withContextMenu: PickProp<IManaged<Data>, "withContextMenu">;
}

/**
 * Renders a component for displaying a list of items.
 *
 * @param props - The properties for the ItemsField component.
 * @param props.value - The current value of the component.
 * @param [props.disabled=false] - Whether the component is disabled or not.
 * @param [props.readonly=false] - Whether the component is readonly or not.
 * @param [props.description] - The description for the component.
 * @param [props.placeholder] - The placeholder text for the component.
 * @param [props.outlined=false] - Whether the component is outlined or not.
 * @param [props.itemList=[]] - The list of items to display.
 * @param [props.freeSolo=false] - Whether the component allows free text input or not.
 * @param [props.virtualListBox=true] - Whether to use a virtual list box for efficiency or not.
 * @param [props.labelShrink] - Whether the label should shrink when there is a value or not.
 * @param [props.watchItemList] - A function to watch the itemList property for changes.
 * @param [props.noDeselect] - Whether to prevent deselecting an item or not.
 * @param [props.dirty] - Whether the component's value is dirty or not.
 * @param [props.invalid] - Whether the component's value is invalid or not.
 * @param [props.incorrect] - Whether the component's value is incorrect or not.
 * @param [props.title] - The title for the component.
 * @param [props.withContextMenu] - Whether to show a context menu for the component or not.
 * @param [props.tr=(s) => s.toString()] - A translation function for translating strings.
 * @param [props.onChange] - A callback function called when the component's value changes.
 *
 * @returns - The rendered Items component.
 */
export const ItemsField = ({
  value,
  disabled,
  readonly,
  description,
  placeholder,
  outlined = false,
  itemList = [],
  freeSolo = false,
  virtualListBox = true,
  labelShrink,
  watchItemList,
  noDeselect,
  dirty,
  invalid,
  incorrect,
  title,
  withContextMenu,
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
    noDeselect={noDeselect}
    labelShrink={labelShrink}
    virtualListBox={virtualListBox}
    watchItemList={watchItemList}
    freeSolo={freeSolo}
    dirty={dirty}
    invalid={invalid}
    incorrect={incorrect}
    title={title}
    tr={tr}
    onChange={onChange}
    withContextMenu={withContextMenu}
  />
);

ItemsField.displayName = 'ItemsField';

export default makeField(ItemsField, {
  withApplyQueue: true,
  skipDebounce: true,
  skipDirtyClickListener: true,
  skipFocusReadonly: true,
});
