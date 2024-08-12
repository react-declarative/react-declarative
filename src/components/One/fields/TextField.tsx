import * as React from "react";

import Text from '../../../components/One/slots/TextSlot';

import makeField from "../components/makeField";

import IManaged, { PickProp } from "../../../model/IManaged";
import IAnything from "../../../model/IAnything";
import IField from "../../../model/IField";

/**
 * Represents the properties for a text field component.
 *
 * @template Data - The type of data associated with the field.
 * @template Payload - The type of payload associated with the field.
 */
export interface ITextFieldProps<Data = IAnything, Payload = IAnything> {
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
   * Represents the input type of a field.
   *
   * @template Data - The type of data being handled by the field.
   * @template Payload - The type of payload associated with the field.
   *
   * @typedef inputType
   *
   * @property name - The name of the input type.
   * @property options - Additional options for the input type.
   */
  inputType?: PickProp<IField<Data, Payload>, "inputType">;
  /**
   * The inputMode variable is an optional property that represents the input mode of a field in a form.
   *
   * @typedef inputMode
   *
   * @property [inputMode] - The input mode of the field.
   */
  inputMode?: PickProp<IField<Data, Payload>, "inputMode">;
  /**
   * Represents the input pattern for a field in a data payload.
   *
   * @typedef inputPattern
   * @property [inputPattern.pattern] - The regular expression pattern that the input value of the field should match.
   */
  inputPattern?: PickProp<IField<Data, Payload>, "inputPattern">;
  /**
   * Represents an optional input autocomplete feature for a field.
   *
   * @template Data - The type of data associated with the field.
   * @template Payload - The type of payload associated with the field.
   * @typedef InputAutocomplete
   * @property inputAutocomplete - Specifies whether the input should have autocomplete feature.
   */
  inputAutocomplete?: PickProp<IField<Data, Payload>, "inputAutocomplete">;
  /**
   * Represents the input formatter function for a specific field in the Data object.
   *
   * @template Data - The type of the data object.
   * @template Payload - The type of the payload object.
   * @param inputFormatter - The input formatter function for the field.
   */
  inputFormatter?: PickProp<IField<Data, Payload>, "inputFormatter">;
  /**
   * Specifies the input formatter symbol for a given field.
   *
   * @typedef inputFormatterSymbol
   */
  inputFormatterSymbol?: PickProp<IField<Data, Payload>, "inputFormatterSymbol">;
  /**
   * Represents the allowed input formatters for a field.
   *
   * @typedef inputFormatterAllowed
   * @property allowedFormatters - An array of strings representing the allowed formatter names.
   */
  inputFormatterAllowed?: PickProp<IField<Data, Payload>, "inputFormatterAllowed">;
  /**
   * Represents an input formatter template used in a field.
   *
   * @typedef InputFormatterTemplate
   */
  inputFormatterTemplate?: PickProp<IField<Data, Payload>, "inputFormatterTemplate">;
  /**
   * Defines the input formatter replace configuration for a field.
   *
   * @typedef inputFormatterReplace
   * @property inputFormatterReplace.dataTransform - The function used to transform the input data before formatting.
   * @property inputFormatterReplace.payloadTransform - The function used to transform the payload before formatting.
   */
  inputFormatterReplace?: PickProp<IField<Data, Payload>, "inputFormatterReplace">;
  /**
   * Returns the "description" property value of the given field object.
   *
   * @template IField - The type of the field object.
   * @template Data - The type of the data associated with the field.
   * @template Payload - The type of the payload object associated with the field.
   *
   * @param field - The field object from which to retrieve the "description" property.
   *
   * @returns The value of the "description" property.
   */
  description?: PickProp<IField<Data, Payload>, "description">;
  /**
   * Type definition to pick the `outlined` property from a given `IField` type.
   *
   * @template T - The type of the `IField` object.
   * @template K - The property to be picked from `IField`.
   */
  outlined?: PickProp<IField<Data, Payload>, "outlined">;
  /**
   * Type definition for the `title` property of an object.
   *
   * @template T - The type of the object from which to pick the property.
   * @template K - The literal type of the property name to pick.
   *
   * @typeparam T - The type of the object from which to pick the property.
   * @typeparam K - The literal type of the property name to pick.
   *
   * @param obj - The object from which to pick the property.
   *
   * @returns the value of the picked property.
   */
  title?: PickProp<IField<Data, Payload>, "title">;
  /**
   * Represents the configuration for the leading icon ripple effect.
   *
   * @typedef LeadingIconRipple
   * @property leadingIconRipple.enable - Indicates whether the leading icon ripple effect is enabled.
   * @property leadingIconRipple.duration - The duration of the leading icon ripple effect in milliseconds.
   */
  leadingIconRipple?: PickProp<IField<Data, Payload>, 'leadingIconRipple'>;
  /**
   * Represents the option to enable or disable the trailing icon ripple effect.
   * @property trailingIconRipple - Set to true to enable the trailing icon ripple effect,
   *     or false to disable it
   */
  trailingIconRipple?: PickProp<IField<Data, Payload>, 'trailingIconRipple'>;
  /**
   * The leadingIcon property represents the leading icon of a field.
   *
   * @typedef leadingIcon
   * @property [icon] - The icon to be displayed as the leading icon.
   * @property [isVisible] - Indicates if the leading icon is visible.
   */
  leadingIcon?: PickProp<IField<Data, Payload>, "leadingIcon">;
  /**
   * Represents the trailing icon configuration for a field.
   *
   * @typedef trailingIcon
   * @property icon - The path or class name of the trailing icon.
   * @property isVisible - Indicates whether the trailing icon is visible or hidden.
   * @property onClick - The event handler function to be executed when the trailing icon is clicked.
   */
  trailingIcon?: PickProp<IField<Data, Payload>, "trailingIcon">;
  /**
   * Represents the leading icon click event handler for a field in a form.
   *
   * @typedef leadingIconClick
   * @param leadingIconClick - The leadingIconClick prop of the field.
   * @returns - Nothing is returned from this function.
   */
  leadingIconClick?: PickProp<IField<Data, Payload>, "leadingIconClick">;
  /**
   * The `trailingIconClick` property is an optional property
   * that represents a callback function to be executed when
   * the trailing icon of a field is clicked.
   *
   * This property is of type `PickProp<IField<Data, Payload>, "trailingIconClick">`,
   * where `IField<Data, Payload>` is a generic type representing a field with
   * `Data` and `Payload` types.
   *
   * @typedef trailingIconClick
   *
   * @param args - The arguments passed to the callback function.
   * @returns
   */
  trailingIconClick?: PickProp<IField<Data, Payload>, "trailingIconClick">;
  /**
   * Represents the number of input rows required for a field.
   *
   * @typedef InputRows
   */
  inputRows?: PickProp<IField<Data, Payload>, "inputRows">;
  /**
   * A type definition representing the `placeholder` property of a given field.
   *
   * @template Data - The type of the field data.
   * @template Payload - The type of the payload for the field.
   * @template T - The type of the field.
   *
   * @typedef T
   */
  placeholder?: PickProp<IField<Data, Payload>, "placeholder">;
  /**
   * Gets the value of the "readonly" property from the provided object.
   *
   * @template T - The type of the object that contains the "readonly" property.
   * @template Prop - The type of the "readonly" property.
   * @param object - The object to get the "readonly" property from.
   * @returns - The value of the "readonly" property.
   */
  readonly?: PickProp<IField<Data, Payload>, "readonly">;
  /**
   * Specifies if the field should be automatically focused.
   *
   * @typedef autoFocus
   * @property [autoFocus] - Indicates if the field should receive focus automatically.
   * @property - The interface that describes the field containing the autoFocus property.
   *
   */
  autoFocus?: PickProp<IField<Data, Payload>, "autoFocus">;
  /**
   * Represents the `disabled` property of a field in a form.
   *
   * @typedef Disabled
   */
  disabled?: PickProp<IField<Data, Payload>, "disabled">;
  /**
   * Represents the reference to a group in a field.
   *
   * @typedef GroupRef
   * @property groupRef - The reference to the group.
   */
  groupRef?: PickProp<IField<Data, Payload>, 'groupRef'>;
  /**
   * Represents the input reference property of a field.
   *
   * @typedef InputRef
   * @property current - A reference to the input element.
   */
  inputRef?: PickProp<IField<Data, Payload>, 'inputRef'>;
  /**
   * Shrink option for labels.
   *
   * @typedef labelShrink
   * @property labelShrink - Whether to apply shrink option to labels.
   */
  labelShrink?: PickProp<IField<Data, Payload>, 'labelShrink'>;
  leadingIconTabIndex?: PickProp<IField<Data, Payload>, 'leadingIconTabIndex'>;
  trailingIconTabIndex?: PickProp<IField<Data, Payload>, 'trailingIconTabIndex'>;
}

/**
 * Represents a private interface for an input field.
 *
 * @template Data - The type of data managed by the input field.
 */
export interface ITextFieldPrivate<Data = IAnything> {
  onChange: PickProp<IManaged<Data>, "onChange">;
  invalid: PickProp<IManaged<Data>, "invalid">;
  incorrect: PickProp<IManaged<Data>, "incorrect">;
  value: PickProp<IManaged<Data>, "value">;
  loading: PickProp<IManaged<Data>, "loading">;
  disabled: PickProp<IManaged<Data>, "disabled">;
  dirty: PickProp<IManaged<Data>, "dirty">;
  name: PickProp<IManaged<Data>, "name">;
}

/**
 * TextField component
 *
 * @typedef TextField
 * @param invalid - Indicates if the input value is invalid
 * @param incorrect - Indicates if the input value is incorrect
 * @param value - The current value of the input field
 * @param disabled - Indicates if the input field is disabled
 * @param readonly - Indicates if the input field is read-only
 * @param inputType - The type of input field (default: "text")
 * @param description - The description or helper text for the input field
 * @param outlined - Indicates if the input field is outlined
 * @param labelShrink - Indicates if the label should shrink when focused
 * @param title - The title or tooltip for the input field
 * @param leadingIconRipple - Indicates if clicking the leading icon should trigger a ripple effect
 * @param trailingIconRipple - Indicates if clicking the trailing icon should trigger a ripple effect
 * @param leadingIcon - The icon component to display at the start of the input field
 * @param trailingIcon - The icon component to display at the end of the input field
 * @param leadingIconClick - The function to call when the leading icon is clicked
 * @param trailingIconClick - The function to call when the trailing icon is clicked
 * @param inputRows - The number of rows for a textarea input field (default: 1)
 * @param placeholder - The placeholder text for the input field
 * @param inputAutocomplete - The autocomplete behavior for the input field (default: "off")
 * @param inputFormatter - A function used to format the input value
 * @param inputFormatterSymbol - The symbol or character used in the input formatter
 * @param inputFormatterAllowed - The list of allowed characters in the input formatter
 * @param inputFormatterTemplate - A template string used in the input formatter
 * @param dirty - Indicates if the input value has been modified
 * @param loading - Indicates if the input field is in a loading state
 * @param onChange - The function to call when the input value changes
 * @param autoFocus - Indicates if the input field should be automatically focused
 * @param inputRef - The reference to the input element
 * @param name - The name of the input field
 * @returns - The TextField component
 */
export const TextField = ({
  invalid,
  incorrect,
  value,
  disabled,
  readonly,
  inputType = "text",
  description = "",
  outlined = false,
  labelShrink,
  title = "",
  leadingIconRipple,
  trailingIconRipple,
  leadingIcon,
  trailingIcon,
  leadingIconClick,
  trailingIconClick,
  inputRows = 1,
  placeholder = "",
  inputAutocomplete = "off",
  inputFormatter,
  inputFormatterSymbol,
  inputFormatterAllowed,
  inputFormatterTemplate,
  dirty,
  loading,
  onChange,
  autoFocus,
  inputRef,
  name,
  leadingIconTabIndex,
  trailingIconTabIndex,
}: ITextFieldProps & ITextFieldPrivate) => (
  <Text
    autoFocus={autoFocus}
    inputRef={inputRef}
    invalid={invalid}
    incorrect={incorrect}
    value={value}
    readonly={readonly}
    disabled={disabled}
    inputType={inputType}
    description={description}
    outlined={outlined}
    title={title}
    leadingIconRipple={leadingIconRipple}
    trailingIconRipple={trailingIconRipple}
    leadingIcon={leadingIcon}
    trailingIcon={trailingIcon}
    labelShrink={labelShrink}
    leadingIconClick={leadingIconClick}
    trailingIconClick={trailingIconClick}
    inputRows={inputRows}
    placeholder={placeholder}
    inputAutocomplete={inputAutocomplete}
    inputFormatter={inputFormatter}
    inputFormatterSymbol={inputFormatterSymbol}
    inputFormatterAllowed={inputFormatterAllowed}
    inputFormatterTemplate={inputFormatterTemplate}
    dirty={dirty}
    loading={loading}
    onChange={onChange}
    name={name}
    leadingIconTabIndex={leadingIconTabIndex}
    trailingIconTabIndex={trailingIconTabIndex}
  />
);

TextField.displayName = 'TextField';

export default makeField(TextField);
