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
  /**
   * Returns the "description" property of the given object if it exists, otherwise returns undefined.
   *
   * @template T - The type of the object to pick the property from.
   * @template K - The key of the property to pick.
   * @param obj - The object to pick the property from.
   * @param key - The key of the property to pick.
   * @returns - The value of the "description" property if it exists, otherwise undefined.
   */
  description?: PickProp<IField<Data, Payload>, "description">;
  /**
   * Type definition for the `placeholder` property.
   *
   * @template T - The type of the field.
   * @template K - The type of the key to pick from the field.
   * @param field - The field object.
   * @param key - The key representing the property to pick from the field.
   * @returns The picked `placeholder` property from the field.
   */
  placeholder?: PickProp<IField<Data, Payload>, "placeholder">;
  /**
   * Picks the specified property "outlined" from the given object type "IField<Data, Payload>".
   *
   * @template Data - The type of data for the field.
   * @template Payload - The type of payload for the field.
   * @template T - The resulting type after picking the property.
   *
   * @param field - The object from which to pick the property.
   *
   * @returns - The value of the "outlined" property.
   */
  outlined?: PickProp<IField<Data, Payload>, "outlined">;
  /**
   * Represents the itemList property of a field in the Data object.
   * @typedef {PickProp<IField<Data, Payload>, "itemList">} itemList
   * @property [itemList] - The value of the itemList property.
   */
  itemList?: PickProp<IField<Data, Payload>, "itemList">;
  /**
   * Represents the `freeSolo` property of a field object.
   *
   * @typedef {import('path/to/types').PickProp<import('path/to/types').IField<Data, Payload>, "freeSolo">} freeSolo
   * @description This property determines if the field supports selecting values that are not contained in the predefined options list.
   * @property [freeSolo] - A boolean value representing if the field allows free text input.
   */
  freeSolo?: PickProp<IField<Data, Payload>, "freeSolo">;
  /**
   * Represents the configuration for a virtual list box field in a form.
   *
   * @typedef {PickProp<IField<Data, Payload>, "virtualListBox">} VirtualListBoxConfig
   * @property virtualListBox - The value of the virtualListBox property.
   */
  virtualListBox?: PickProp<IField<Data, Payload>, "virtualListBox">;
  /**
   * Represents an optional readonly flag of a field.
   *
   * @typedef {PickProp<IField<Data, Payload>, "readonly">} readonly
   */
  readonly?: PickProp<IField<Data, Payload>, "readonly">;
  /**
   * Represents the "disabled" property of a field.
   *
   * @typedef {PickProp<IField<Data, Payload>, "disabled">} disabled
   * @property value - Indicates whether the field is disabled or not.
   */
  disabled?: PickProp<IField<Data, Payload>, "disabled">;
  /**
   * Represents a configuration option for disabling deselect functionality.
   *
   * @template Data - The type of data associated with the field.
   * @template Payload - The type of payload associated with the field.
   * @typedef {PickProp<IField<Data, Payload>, "noDeselect">} noDeselect
   */
  noDeselect?: PickProp<IField<Data, Payload>, "noDeselect">;
  /**
   * Type definition for the "title" property of an object.
   *
   * Suppose we have an object of type "IField<Data, Payload>". This type represents a field
   * in a form, where "Data" is the type of the form data and "Payload" is the type of data that
   * should be submitted when the form is submitted.
   *
   * The "PickProp" utility type is used to extract the "title" property from the "IField<Data, Payload>"
   * type. This variable represents the extracted type.
   *
   * @template Data - The type of the form data.
   * @template Payload - The type of the data to be submitted.
   *
   * @typedef {string} PickProp<IField<Data, Payload>, "title">
   */
  title?: PickProp<IField<Data, Payload>, "title">;
  /**
   * Represents the "tr" property of a field in the given data and payload.
   *
   * @template Data - The type of data.
   * @template Payload - The type of payload.
   * @typeParam IField - The type of field.
   * @typeParam PickProp - The type for picking properties.
   *
   * @property tr - The "tr" property of the field.
   */
  tr?: PickProp<IField<Data, Payload>, "tr">;
  /**
   * Retrieves the value of the 'groupRef' property from the given object 'fieldData'.
   *
   * @param fieldData - The object containing the 'groupRef' property.
   *
   * @returns - The value of the 'groupRef' property from 'fieldData', or undefined if it doesn't exist.
   */
  groupRef?: PickProp<IField<Data, Payload>, 'groupRef'>;
  /**
   * Represents the optional "labelShrink" property of an object that implements the `IField<Data>` interface.
   * The "labelShrink" property is of type `PickProp<IField<Data>, "labelShrink">`, which picks the "labelShrink" property
   * from the `IField<Data>` interface.
   *
   * @typedef {PickProp<IField<Data>, "labelShrink">} labelShrink
   */
  labelShrink?: PickProp<IField<Data>, "labelShrink">;
  /**
   * Represents a variable watchItemList.
   * @typedef {PickProp<IField<Data>, "watchItemList">} watchItemList
   * @property watchItemList - The watchItemList property of type PickProp<IField<Data>, "watchItemList">
   */
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
