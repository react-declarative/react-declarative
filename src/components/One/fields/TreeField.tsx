import * as React from "react";

import Tree from '../../../components/One/slots/TreeSlot';

import makeField from "../components/makeField";

import IManaged, { PickProp } from "../../../model/IManaged";
import IAnything from "../../../model/IAnything";
import IField from "../../../model/IField";

/**
 * Interface for the props of the ITreeField component.
 *
 * @template Data The type of data in the field.
 * @template Payload The type of payload in the field.
 */
export interface ITreeFieldProps<Data = IAnything, Payload = IAnything> {
  /**
   * Returns the "description" property of a given object.
   *
   * @template T - The type of the object.
   * @template K - The literal key type.
   *
   * @param obj - The object from which to extract the property.
   * @param key - The literal key representing the property to extract.
   *
   * @returns - The value of the specified property.
   */
  description?: PickProp<IField<Data, Payload>, "description">;
  /**
   * Type declaration for the PickProp utility function.
   */
  outlined?: PickProp<IField<Data, Payload>, "outlined">;
  /**
   * Type definition for the "title" property picked from the given object type.
   *
   * @template IField - The object type that contains the "title" property.
   * @template Data - The data type of the "title" property.
   * @template Payload - The payload type of the "title" property.
   *
   * @param - The object from which the "title" property will be picked.
   *
   * @returns - The resulting object that only contains the "title" property.
   */
  title?: PickProp<IField<Data, Payload>, "title">;
  /**
   * Type definition for the variable placeholder.
   *
   * @template Data - The type of data for the field.
   * @template Payload - The type of payload for the field.
   * @typedef placeholder
   */
  placeholder?: PickProp<IField<Data, Payload>, "placeholder">;
  /**
   * Specifies if a field is readOnly.
   *
   * @typedef Readonly
   *
   * @typedef IField
   * @typedef Payload
   * @typedef PickProp
   * @typedef Data
   *
   * @param readonly - The field being checked for readOnly status.
   *
   * @returns - A boolean value indicating if the field is readOnly.
   */
  readonly?: PickProp<IField<Data, Payload>, "readonly">;
  /**
   * Represents the `disabled` property of a field in a form.
   *
   * @typedef Disabled
   *
   * @property disabled - Indicates whether the field is disabled or not.
   * @template Data - The type of data stored in the form.
   * @template Payload - The type of payload used for form submission.
   */
  disabled?: PickProp<IField<Data, Payload>, "disabled">;
  /**
   * Represents the item tree of a specific field in the data payload.
   *
   * @typedef ItemTree
   */
  itemTree?: PickProp<IField<Data, Payload>, 'itemTree'>;
}

/**
 * Represents the private interface for the TreeField component.
 *
 * @template Data The type of data for the TreeField component.
 */
export interface ITreeFieldPrivate<Data = IAnything> {
  onChange: PickProp<IManaged<Data>, "onChange">;
  invalid: PickProp<IManaged<Data>, "invalid">;
  incorrect: PickProp<IManaged<Data>, "incorrect">;
  value: PickProp<IManaged<Data>, "value">;
  loading: PickProp<IManaged<Data>, "loading">;
  disabled: PickProp<IManaged<Data>, "disabled">;
  dirty: PickProp<IManaged<Data>, "dirty">;
  name: PickProp<IManaged<Data>, "name">;
  withContextMenu: PickProp<IManaged<Data>, "withContextMenu">;
}

/**
 * Renders a TreeField component.
 *
 * @param props - The props object containing the necessary data for rendering the TreeField.
 * @param props.invalid - Determines if the TreeField is invalid.
 * @param props.value - The value of the TreeField.
 * @param props.disabled - Determines if the TreeField is disabled.
 * @param props.readonly - Determines if the TreeField is readonly.
 * @param props.incorrect - Determines if the TreeField is incorrect.
 * @param props.description - The description text for the TreeField.
 * @param props.outlined - Determines if the TreeField should have an outlined style.
 * @param props.title - The title text for the TreeField.
 * @param props.placeholder - The placeholder text for the TreeField.
 * @param props.itemTree - The itemTree object for rendering the Tree.
 * @param props.dirty - Determines if the TreeField has been modified.
 * @param props.loading - Determines if the TreeField is currently loading.
 * @param props.onChange - The callback function to be called when the value of the TreeField changes.
 * @param props.name - The name attribute of the TreeField.
 * @param props.withContextMenu - Determines if the TreeField should have a context menu.
 *
 * @returns The rendered TreeField component.
 */
export const TreeField = ({
  invalid,
  value,
  disabled,
  readonly,
  incorrect,
  description = "",
  outlined = false,
  title = "",
  placeholder = "",
  itemTree,
  dirty,
  loading,
  onChange,
  name,
  withContextMenu,
}: ITreeFieldProps & ITreeFieldPrivate) => (
  <Tree
    invalid={invalid}
    incorrect={incorrect}
    value={value}
    readonly={readonly}
    disabled={disabled}
    description={description}
    outlined={outlined}
    title={title}
    placeholder={placeholder}
    withContextMenu={withContextMenu}
    itemTree={itemTree}
    dirty={dirty}
    loading={loading}
    onChange={onChange}
    name={name}
  />
);

TreeField.displayName = 'TreeField';

export default makeField(TreeField, {
  withApplyQueue: true,
  skipDirtyClickListener: true,
  skipFocusReadonly: true,
  skipDebounce: true,
});
