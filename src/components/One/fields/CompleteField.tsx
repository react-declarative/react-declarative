import * as React from "react";

import Complete from "../../../components/One/slots/CompleteSlot";

import makeField from "../components/makeField";

import IManaged, { PickProp } from "../../../model/IManaged";
import IAnything from "../../../model/IAnything";
import IField from "../../../model/IField";

/**
 * Interface for specifying the props of a complete field.
 * @template Data, Payload - The types of data and payload.
 */
export interface ICompleteFieldProps<Data = IAnything, Payload = IAnything> {
  /**
   * Represents the input type of a field.
   *
   * @template Data The type of data associated with the field.
   * @template Payload The type of payload associated with the field.
   * @typedef {PickProp<IField<Data, Payload>, "inputType">} inputType
   *
   * @property {string} inputType - The type of input for the field.
   */
  inputType?: PickProp<IField<Data, Payload>, "inputType">;
  /**
   * Represents the input mode of a field in the data object payload.
   *
   * @typedef {PickProp<IField<Data, Payload>, "inputMode">} inputMode
   * @property {string} inputMode - The input mode of the field.
   */
  inputMode?: PickProp<IField<Data, Payload>, "inputMode">;
  /**
   * Represents the input pattern of a field.
   *
   * @typedef {Object} inputPattern
   * @property {string} [inputPattern.prop1] - The first property of the input pattern.
   * @property {boolean} [inputPattern.prop2] - The second property of the input pattern.
   *
   * @typedef {import('./IField').IField<Data, Payload>} IField
   * @typedef {import('./IField').Data} Data
   * @typedef {import('./IField').Payload} Payload
   * @typedef {import('./PickProp').PickProp} PickProp
   */
  inputPattern?: PickProp<IField<Data, Payload>, "inputPattern">;
  /**
   * Represents the optional prop "inputAutocomplete" for a field.
   *
   * @typedef {object} PickProp
   * @property {IField<Data, Payload>} _field - The field to pick the prop from.
   * @property {"inputAutocomplete"} _prop - The name of the prop to pick.
   *
   * @param {PickProp<IField<Data, Payload>, "inputAutocomplete">} inputAutocomplete - The value of the "inputAutocomplete" prop.
   *
   * @returns {void}
   */
  inputAutocomplete?: PickProp<IField<Data, Payload>, "inputAutocomplete">;
  /**
   * Retrieves the "description" property from a given object and its nested properties if available.
   *
   * @template T - The type of the object to pick the "description" property from.
   * @template K - The keys of the properties in T.
   * @param {T} obj - The object to pick the "description" property from.
   * @returns {Pick<T, K>} - The picked object with "description" property.
   */
  description?: PickProp<IField<Data, Payload>, "description">;
  /**
   * Reduces the size of the label for a given field.
   *
   * @param {PickProp<IField<Data>, "labelShrink">} labelShrink - The label shrink configuration for a field.
   * @returns {undefined}
   */
  labelShrink?: PickProp<IField<Data>, "labelShrink">;
  /**
   * Represents the value of the `keepRaw` property, which indicates whether to keep the raw data in a field.
   *
   * @template Data - The data type of the field.
   * @template Payload - The payload type of the field.
   *
   * @typedef {PickProp<IField<Data, Payload>, "keepRaw">} KeepRaw
   * @property {boolean} keepRaw - Indicates whether to keep the raw data.
   */
  keepRaw?: PickProp<IField<Data, Payload>, "keepRaw">;
  /**
   * Returns the value of the `outlined` property from the provided object.
   *
   * @template T - The type of the object.
   * @template K - The keyof `T` representing the property to pick.
   *
   * @param {T} obj - The object from which to pick the property.
   * @param {K} field - The key representing the property to pick.
   *
   * @returns {Pick<T, K>[K]} - The value of the picked property.
   */
  outlined?: PickProp<IField<Data, Payload>, "outlined">;
  /**
   * Type definition for the "title" property picked from the "IField" object type,
   * where "IField" is a generic object with properties "Data" and "Payload".
   * The resulting type is determined by the "PickProp" utility, which selects the specific property
   * from the provided object type.
   *
   * @template IField - The generic object type with properties "Data" and "Payload".
   * @template Data - The data type of the "IField" object.
   * @template Payload - The payload type of the "IField" object.
   * @template Key - The specific property key to pick from the "IField" object.
   * @typedef PickProp
   * @property {IField<Data, Payload>} object - The object from which the property is picked.
   * @property {Key} prop - The specific property key to pick.
   * @returns The type of the picked property.
   */
  title?: PickProp<IField<Data, Payload>, "title">;
  /**
   * Represents the "tip" property of an object.
   *
   * @template T - The type of the object.
   * @template K - The key of the property to pick.
   * @typedef {K extends keyof T ? T[K] : undefined} PickProp
   */
  tip?: PickProp<IField<Data, Payload>, "tip">;
  /**
   * Represents a variable that holds the value of the "tipSelect" property.
   *
   * @typedef {PickProp<IField<Data, Payload>, "tipSelect">} TipSelect
   * @property {IField<Data, Payload>} IField - Represents a generic field object.
   * @property {Data} Data - Represents the generic data type.
   * @property {Payload} Payload - Represents the generic payload type.
   * @property {string} tipSelect - The value of the "tipSelect" property.
   */
  tipSelect?: PickProp<IField<Data, Payload>, "tipSelect">;
  /**
   * Retrieves the `placeholder` property of a given field.
   *
   * @template Data - The type of data associated with the field.
   * @template Payload - The type of payload associated with the field.
   * @template Field - The type of field.
   *
   * @typedef PickProp - A utility type for picking properties from a type.
   * @param {Field} field - The field to pick the `placeholder` property from.
   *
   * @returns {string | undefined} - The `placeholder` property of the given field, if present. Otherwise, `undefined`.
   */
  placeholder?: PickProp<IField<Data, Payload>, "placeholder">;
  /**
   * Retrieves the "readonly" property from the provided field object.
   *
   * @param {IField<Data, Payload>} field - The field object.
   * @returns {PickProp<IField<Data, Payload>, "readonly">} - The value of the "readonly" property.
   */
  readonly?: PickProp<IField<Data, Payload>, "readonly">;
  /**
   * Specifies whether the field should be automatically focused.
   *
   * @typedef {PickProp<IField<Data, Payload>, "autoFocus">} autoFocus
   */
  autoFocus?: PickProp<IField<Data, Payload>, "autoFocus">;
  /**
   * Represents the "disabled" property of a field.
   *
   * @template Data - The type of data associated with the field.
   * @template Payload - The type of payload for the field's actions.
   *
   * @typedef {PickProp<IField<Data, Payload>, "disabled">} DisabledProp
   *
   * @property {boolean} disabled - Specifies whether the field is disabled.
   */
  disabled?: PickProp<IField<Data, Payload>, "disabled">;
  /**
   * Represents a reference to a group within a field.
   *
   * @typedef {PickProp<IField<Data, Payload>, "groupRef">} GroupRef
   * @property {string} groupRef - The identifier of the group.
   */
  groupRef?: PickProp<IField<Data, Payload>, "groupRef">;
  /**
   * Represents the input reference of a field.
   *
   * @typedef {PickProp<IField<Data, Payload>, "inputRef">} InputRef
   * @property {string} inputRef - The reference to the input element.
   *
   */
  inputRef?: PickProp<IField<Data, Payload>, "inputRef">;
  /**
   * Represents the input formatter property of a field within a specific data type.
   *
   * @template Data - The data type containing the field.
   * @template Payload - The payload type containing the data.
   */
  inputFormatter?: PickProp<IField<Data, Payload>, "inputFormatter">;
  /**
   * Represents the input formatter symbol for a specific field.
   */
  inputFormatterSymbol?: PickProp<
    IField<Data, Payload>,
    "inputFormatterSymbol"
  >;
  /**
   * Determines whether input formatting is allowed for a given field.
   *
   * @typedef {PickProp<IField<Data, Payload>, "inputFormatterAllowed">} inputFormatterAllowed
   * @property {boolean} inputFormatterAllowed - Specifies if input formatting is allowed.
   */
  inputFormatterAllowed?: PickProp<
    IField<Data, Payload>,
    "inputFormatterAllowed"
  >;
  /**
   * Represents a template for formatting input data.
   *
   */
  inputFormatterTemplate?: PickProp<
    IField<Data, Payload>,
    "inputFormatterTemplate"
  >;
  /**
   * Replaces the input formatter of a field with a new one.
   *
   * @template Data The data type of the field.
   * @template Payload The payload type of the field.
   *
   * @param {PickProp<IField<Data, Payload>, "inputFormatterReplace">} inputFormatterReplace The object containing the "inputFormatterReplace" property.
   *
   */
  inputFormatterReplace?: PickProp<
    IField<Data, Payload>,
    "inputFormatterReplace"
  >;
}

/**
 * Represents a private interface for a complete field.
 *
 * @template Data - The type of the field's data.
 */
export interface ICompleteFieldPrivate<Data = IAnything> {
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
 * A wrapper component for the Complete component.
 *
 * @param props - The props for the CompleteField component.
 * @param props.invalid - Determines whether the field is in an invalid state.
 * @param props.incorrect - Determines whether the field has incorrect data.
 * @param props.value - The current value of the field.
 * @param props.disabled - Determines whether the field is disabled.
 * @param props.readonly - Determines whether the field is read-only.
 * @param props.inputType - The type of the input field.
 * @param props.description - The description of the field.
 * @param props.outlined - Determines whether the field is outlined.
 * @param props.keepRaw - Determines whether the raw value should be kept.
 * @param props.title - The title of the field.
 * @param props.labelShrink - The label shrink value.
 * @param props.tip - The tip for the field.
 * @param props.tipSelect - The tip for the select field.
 * @param props.placeholder - The placeholder text for the input field.
 * @param props.inputAutocomplete - The autocomplete attribute for the input field.
 * @param props.dirty - The dirty value of the field.
 * @param props.loading - Determines whether the field is in a loading state.
 * @param props.onChange - The callback function for the field value change event.
 * @param props.autoFocus - Determines whether the field should be auto-focused.
 * @param props.inputRef - The reference to the input field.
 * @param props.name - The name of the field.
 * @param props.inputFormatter - The input formatter for the field.
 * @param props.inputFormatterAllowed - The allowed values for the input formatter.
 * @param props.inputFormatterReplace - The values to replace in the input formatter.
 * @param props.inputFormatterSymbol - The symbol for the input formatter.
 * @param props.inputFormatterTemplate - The template for the input formatter.
 * @param props.withContextMenu - Determines whether the field should have a context menu.
 * @returns The rendered CompleteField component.
 */
export const CompleteField = ({
  invalid,
  incorrect,
  value,
  disabled,
  readonly,
  inputType = "text",
  description = "",
  outlined = false,
  keepRaw = false,
  title = "",
  labelShrink,
  tip,
  tipSelect,
  placeholder = "",
  inputAutocomplete = "off",
  dirty,
  loading,
  onChange,
  autoFocus,
  inputRef,
  name,
  inputFormatter,
  inputFormatterAllowed,
  inputFormatterReplace,
  inputFormatterSymbol,
  inputFormatterTemplate,
  withContextMenu,
}: ICompleteFieldProps & ICompleteFieldPrivate) => (
  <Complete
    autoFocus={autoFocus}
    inputRef={inputRef}
    invalid={invalid}
    incorrect={incorrect}
    value={value}
    readonly={readonly}
    disabled={disabled}
    inputType={inputType}
    description={description}
    withContextMenu={withContextMenu}
    outlined={outlined}
    keepRaw={keepRaw}
    labelShrink={labelShrink}
    title={title}
    tip={tip}
    tipSelect={tipSelect}
    placeholder={placeholder}
    inputAutocomplete={inputAutocomplete}
    dirty={dirty}
    loading={loading}
    onChange={onChange}
    name={name}
    inputFormatter={inputFormatter}
    inputFormatterAllowed={inputFormatterAllowed}
    inputFormatterReplace={inputFormatterReplace}
    inputFormatterSymbol={inputFormatterSymbol}
    inputFormatterTemplate={inputFormatterTemplate}
  />
);

CompleteField.displayName = "CompleteField";

export default makeField(CompleteField);
