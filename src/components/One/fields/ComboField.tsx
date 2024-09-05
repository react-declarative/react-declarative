import * as React from "react";

import Combo from "../../../components/One/slots/ComboSlot";

import makeField from "../components/makeField";

import IManaged, { PickProp } from "../../../model/IManaged";
import IAnything from "../../../model/IAnything";
import IField from "../../../model/IField";

/**
 * Represents the properties for the ComboField component.
 *
 * @template Data - The type of data associated with the field.
 * @template Payload - The type of payload associated with the field.
 */
export interface IComboFieldProps<Data = IAnything, Payload = IAnything> {
  /**
   * Validation factory config
   *
   * @template IField - Type representing the field object.
   * @template Data - Type representing the data object.
   * @template Payload - Type representing the payload object.
   * 
   * @returns The value of the "validation" property.
   */
  validation?: PickProp<IField<Data, Payload>, 'validation'>;
  /**
   * Retrieves the "description" property
   */
  description?: PickProp<IField<Data, Payload>, "description">;
  /**
   * Represents the `placeholder` property of a field.
   *
   * @template Data - The type of data associated with the field.
   * @template Payload - The type of payload associated with the field.
   * @typedef FieldPlaceholder
   */
  placeholder?: PickProp<IField<Data, Payload>, "placeholder">;
  /**
   * Type outlined defenition
   *
   * @template T - The type of the input object.
   * @template K - The name of the property to pick from the input object.
   *
   * @typedef PickProp
   */
  outlined?: PickProp<IField<Data, Payload>, "outlined">;
  /**
   * Represents a list of items from a specific field's data payload.
   *
   * @typedef itemList
   */
  itemList?: PickProp<IField<Data, Payload>, "itemList">;
  /**
   * Represents the `freeSolo` property of an object.
   *
   * @typedef freeSolo
   * @property [freeSolo] - Indicates whether or not the field allows free-form input.
   * @property field - The parent field object.
   * @property - The type of data associated with the field.
   * @property - The type of payload associated with the field.
   */
  freeSolo?: PickProp<IField<Data, Payload>, "freeSolo">;
  /**
   * Specifies whether the field should allow deselection.
   *
   * @template Data - The data type of the field.
   * @template Payload - The payload type of the field.
   * @typedef noDeselect
   *
   * @param noDeselect - The value of the noDeselect property.
   *
   * @returns - This function does not return any value.
   */
  noDeselect?: PickProp<IField<Data, Payload>, "noDeselect">;
  /**
   * Represents a virtual list box configuration.
   *
   * @typedef virtualListBox
   *
   * @property enabled - Indicates whether the virtual list box is enabled or not.
   * @property size - The number of items to render per batch in the virtual list box.
   * @property infiniteScroll - Indicates whether the virtual list box should support infinite scrolling or not.
   * @property useWindowScroll - Indicates whether the virtual list box should use window scroll or not.
   */
  virtualListBox?: PickProp<IField<Data, Payload>, "virtualListBox">;
  /**
   * Represents the watch item list for a specific field.
   *
   * @typedef watchItemList
   * @property - An array of watch items.
   */
  watchItemList?: PickProp<IField<Data, Payload>, "watchItemList">;
  /**
   * Retrieves the "readonly" property from a given object of type IField<Data, Payload>.
   *
   * @param field - The object from which to retrieve the "readonly" property.
   * @returns The value of the "readonly" property.
   */
  readonly?: PickProp<IField<Data, Payload>, "readonly">;
  /**
   * Represents the "disabled" property of a field.
   *
   * @typedef Disabled
   * @property disabled - Indicates if the field is disabled or not.
   */
  disabled?: PickProp<IField<Data, Payload>, "disabled">;
  /**
   * Represents the property `labelShrink` which is an optional pick property of type `PickProp<IField<Data>, "labelShrink">`.
   *
   * @typedef labelShrink
   */
  labelShrink?: PickProp<IField<Data>, "labelShrink">;
  /**
   * Retrieves the "title" property for a field
   */
  title?: PickProp<IField<Data, Payload>, "title">;
  /**
   * Represents an optional property "tr" of type PickProp<IField<Data, Payload>, "tr">.
   *
   * @typedef tr
   */
  tr?: PickProp<IField<Data, Payload>, "tr">;
  /**
   * This variable represents a reference to a group within a field's data payload.
   * It is an optional property and is of type `PickProp<IField<Data, Payload>, 'groupRef'>`.
   *
   * @typedef groupRef
   */
  groupRef?: PickProp<IField<Data, Payload>, 'groupRef'>;
}

/**
 * Represents the private interface for the ComboField class.
 * @template Data - The type of data managed by the ComboField.
 */
export interface IComboFieldPrivate<Data = IAnything>  {
  value: PickProp<IManaged<Data>, "value">;
  readonly: PickProp<IManaged<Data>, "readonly">;
  fieldReadonly: PickProp<IManaged<Data>, "fieldReadonly">;
  onChange: PickProp<IManaged<Data>, "onChange">;
  dirty: PickProp<IManaged<Data>, "dirty">;
  loading: PickProp<IManaged<Data>, "loading">;
  invalid: PickProp<IManaged<Data>, "invalid">;
  incorrect: PickProp<IManaged<Data>, "incorrect">;
  withContextMenu: PickProp<IManaged<Data>, "withContextMenu">;
}

/**
 * ComboField component.
 *
 * @param props - The props object.
 * @param props.value - The value of the ComboField.
 * @param [props.disabled=false] - Specifies whether the ComboField is disabled.
 * @param [props.readonly=false] - Specifies whether the ComboField is readonly.
 * @param [props.description=""] - The description of the ComboField.
 * @param [props.placeholder=""] - The placeholder text of the ComboField.
 * @param [props.outlined=false] - Specifies whether the ComboField should be outlined.
 * @param [props.itemList=[]] - The list of items for the ComboField.
 * @param [props.freeSolo=false] - Specifies whether the ComboField allows free text input.
 * @param [props.virtualListBox=true] - Specifies whether the ComboField should use a virtual list box for rendering.
 * @param [props.watchItemList] - Specifies whether to watch changes in the itemList prop.
 * @param [props.noDeselect] - Specifies whether the ComboField should prevent deselecting options.
 * @param [props.labelShrink] - Specifies whether the label of the ComboField should shrink when there is a value.
 * @param [props.title=""] - The title of the ComboField.
 * @param [props.dirty] - Specifies whether the ComboField has been modified.
 * @param [props.invalid] - Specifies whether the ComboField is invalid.
 * @param [props.incorrect] - Specifies whether the ComboField has incorrect data.
 * @param [props.withContextMenu] - Specifies whether the ComboField should display a context menu.
 * @param [props.tr=(s) => s.toString()] - The translation function for the ComboField.
 * @param [props.onChange] - The event handler function for onChange event.
 *
 * @returns The ComboField component.
 */
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
  loading,
  invalid,
  incorrect,
  fieldReadonly,
  withContextMenu,
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
    loading={loading}
    incorrect={incorrect}
    fieldReadonly={fieldReadonly}
    withContextMenu={withContextMenu}
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
