import * as React from "react";

import Dict from "../../../components/One/slots/DictSlot";

import makeField from "../components/makeField";

import IManaged, { PickProp } from "../../../model/IManaged";
import IAnything from "../../../model/IAnything";
import IField from "../../../model/IField";

/**
 * Props for the IDictField component.
 *
 * @template Data - The data type of the field.
 * @template Payload - The payload type of the field.
 *
 * @property [dictLimit] - The limit of items shown in the dictionary.
 * @property [dictDelay] - The delay between input and dictionary search.
 * @property [dictSearch] - The search function for the dictionary.
 * @property [dictOnAppend] - The function called when an item is appended to the dictionary.
 * @property [dictOnText] - The function called when the text of a dictionary item is updated.
 * @property [dictOnItem] - The function called when a dictionary item is selected.
 * @property [dictValue] - The selected value from the dictionary.
 * @property [dictSearchText] - The text being searched in the dictionary.
 * @property [dictSearchItem] - The item being searched in the dictionary.
 * @property [dictCreateButton] - The button to create a new item in the dictionary.
 * @property [inputType] - The type of input element.
 * @property [inputMode] - The input mode.
 * @property [inputPattern] - The regex pattern for input validation.
 * @property [inputAutocomplete] - The autocomplete option for the input.
 * @property [inputFormatter] - The function to format the input value.
 * @property [inputFormatterSymbol] - The symbol used for formatting.
 * @property [inputFormatterAllowed] - The allowed characters for formatting.
 * @property [inputFormatterTemplate] - The template for formatting.
 * @property [inputFormatterReplace] - The replace option for formatting.
 * @property [description] - The description of the field.
 * @property [outlined] - Whether the field should be outlined.
 * @property [title] - The title of the field.
 * @property [placeholder] - The placeholder text for the input.
 * @property [readonly] - Whether the field should be read-only.
 * @property [disabled] - Whether the field should be disabled.
 * @property [groupRef] - The ref for the group element.
 * @property [inputRef] - The ref for the input element.
 * @property [leadingIconRipple] - Whether the leading icon should have ripple effect.
 * @property [trailingIconRipple] - Whether the trailing icon should have ripple effect.
 * @property [leadingIcon] - The icon element for the leading icon.
 * @property [trailingIcon] - The icon element for the trailing icon.
 * @property [leadingIconClick] - The function to call when the leading icon is clicked.
 * @property [trailingIconClick] - The function to call when the trailing icon is clicked.
 */
export interface IDictFieldProps<Data = IAnything, Payload = IAnything> {
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
   * Represents the 'dictLimit' property of an object.
   *
   * @typedef dictLimit
   * @property [dictLimit] - The limit for the dictionary.
   * @returns - The limit for the dictionary.
   */
  dictLimit?: PickProp<IField<Data, Payload>, "dictLimit">;
  /**
   * Retrieves the optional "dictDelay" property from the provided object.
   *
   * @template Data - The data type of the object.
   * @template Payload - The payload type of the object.
   *
   * @param object - The object containing the "dictDelay" property.
   *
   * @returns The value of the "dictDelay" property, if it exists, or undefined if it does not.
   */
  dictDelay?: PickProp<IField<Data, Payload>, "dictDelay">;
  /**
   * @typedef IField
   * @typedef Payload
   * @typedef Data
   * @typedef PickProp
   *
   * @typedef dictSearch
   */
  dictSearch?: PickProp<IField<Data, Payload>, "dictSearch">;
  /**
   * Represents an optional configuration property for a dictionary append operation.
   */
  dictOnAppend?: PickProp<IField<Data, Payload>, "dictOnAppend">;
  /**
   * Represents a variable `dictOnText` which is optional and can be of type `PickProp<IField<Data, Payload>, "dictOnText">`.
   *
   * @typedef dictOnText
   */
  dictOnText?: PickProp<IField<Data, Payload>, "dictOnText">;
  /**
   * Represents the field configuration for `dictOnItem` property.
   *
   * @template Data - The type of data object for the field.
   * @template Payload - The type of payload for the field.
   * @typedef dictOnItem?
   * @property dictOnItem - Indicates whether the field uses dictionary on item.
   */
  dictOnItem?: PickProp<IField<Data, Payload>, "dictOnItem">;
  /**
   * Retrieves the "dictValue" property from the given object.
   *
   * @param obj - The object from which to retrieve the "dictValue" property.
   *
   * @returns - The value of the "dictValue" property, or undefined if it does not exist.
   */
  dictValue?: PickProp<IField<Data, Payload>, "dictValue">;
  /**
   * @typedef IField
   * @property data - The data object
   * @property payload - The payload object
   */
  dictSearchText?: PickProp<IField<Data, Payload>, "dictSearchText">;
  /**
   * Represents the 'dictSearchItem' property of an object.
   *
   * @typedef dictSearchItem
   *
   * @description
   * This property is an optional field that is used to store information related to dictionary search item.
   * It is extracted from the 'IField' interface using the 'PickProp' utility type.
   *
   * @see {@link IField}
   * @see {@link PickProp}
   */
  dictSearchItem?: PickProp<IField<Data, Payload>, "dictSearchItem">;
  /**
   * Retrieves the value of the "dictCreateButton" property from the provided object,
   * which is of type PickProp<IField<Data, Payload>, "dictCreateButton">.
   *
   * @param input - The input object.
   * @returns - Returns the value of the "dictCreateButton" property,
   *                                       which can be of type "undefined" or "someDataType".
   */
  dictCreateButton?: PickProp<IField<Data, Payload>, "dictCreateButton">;
  /**
   * Represents the input type of a field.
   *
   * @typedef InputType
   *
   * @property inputType - The type of input for the field.
   */
  inputType?: PickProp<IField<Data, Payload>, "inputType">;
  /**
   * Represents the input mode configuration for a field.
   *
   * @typedef inputMode
   * @property inputMode - The input mode for the field.
   */
  inputMode?: PickProp<IField<Data, Payload>, "inputMode">;
  /**
   * Represents the input pattern of a field in the form.
   *
   * @typedef PickProp<IField<Data, Payload>, "inputPattern">
   * @property [inputPattern] - The regular expression pattern that the input value of the field must match.
   */
  inputPattern?: PickProp<IField<Data, Payload>, "inputPattern">;
  /**
   * Retrieves the value of the "inputAutocomplete" property from the specified object.
   *
   * @template Data The type of the data object.
   * @template Payload The type of the payload object.
   * @template T The type of the object.
   * @param obj The object from which to retrieve the "inputAutocomplete" property.
   * @returns The value of the "inputAutocomplete" property,
   * or undefined if the property doesn't exist.
   */
  inputAutocomplete?: PickProp<IField<Data, Payload>, "inputAutocomplete">;
  /**
   * Represents an input formatter for a specific type of field in a form.
   *
   * @template Data - The type of data object associated with the form.
   * @template Payload - The type of payload for the field.
   */
  inputFormatter?: PickProp<IField<Data, Payload>, "inputFormatter">;
  /**
   * Represents a symbol used by the input formatter for a given field.
   *
   * @typedef inputFormatterSymbol
   *
   * @property inputFormatterSymbol - The symbol used by the input formatter.
   */
  inputFormatterSymbol?: PickProp<
    IField<Data, Payload>,
    "inputFormatterSymbol"
  >;
  /**
   * Represents the allowed input formatters for a field.
   *
   * @typedef inputFormatterAllowed
   * @property inputFormatterAllowed - An array of allowed input formatter names.
   */
  inputFormatterAllowed?: PickProp<
    IField<Data, Payload>,
    "inputFormatterAllowed"
  >;
  /**
   * Represents a template for input formatter.
   *
   * @typedef InputFormatterTemplate
   */
  inputFormatterTemplate?: PickProp<
    IField<Data, Payload>,
    "inputFormatterTemplate"
  >;
  /**
   * Represents an object property `inputFormatterReplace` of the interface `IField<Data, Payload>`.
   *
   * @typedef inputFormatterReplace
   * @property inputFormatterReplace - The value of the `inputFormatterReplace` property.
   * @see {@link IField}
   * @see {@link PickProp}
   */
  inputFormatterReplace?: PickProp<
    IField<Data, Payload>,
    "inputFormatterReplace"
  >;
  /**
   * Type definition for the PickProp function.
   *
   * @template T - The type of the object to pick from.
   * @template K - The type of the property to pick.
   * @param object - The object to pick from.
   * @param prop - The property to pick from the object.
   * @returns The value of the picked property.
   */
  description?: PickProp<IField<Data, Payload>, "description">;
  /**
   * A type representing the picked property "outlined" from the given object type.
   *
   * @template T - The object type to pick the property from.
   * @template K - The name of the property to pick.
   */
  outlined?: PickProp<IField<Data, Payload>, "outlined">;
  /**
   * Type declaration for the utility function `PickProp`.
   *
   * @template T - The type of the input object.
   * @template K - The type of the property to pick.
   */
  title?: PickProp<IField<Data, Payload>, "title">;
  /**
   * Type definition for the `placeholder` property of `PickProp` type.
   *
   * The `placeholder` property represents a subset of the `IField<Data, Payload>` type,
   * where it specifically picks the `placeholder` property.
   *
   * @template Data - The type of the `Data` object in `IField`.
   * @template Payload - The type of the `Payload` object in `IField`.
   *
   * @typedef PlaceholderType
   *
   */
  placeholder?: PickProp<IField<Data, Payload>, "placeholder">;
  /**
   * The `readonly` property of the `IField` object.
   *
   * @typedef readonly
   * @property value - A boolean value indicating if the field is read-only or not.
   */
  readonly?: PickProp<IField<Data, Payload>, "readonly">;
  /**
   * Represents the `disabled` property of a given field in a form.
   *
   * @template Data - The data type of the field.
   * @template Payload - The payload type of the field.
   * @template IField - The interface of the field.
   * @template PickProp - Utility to pick a property from an interface.
   *
   * @param field - The given field in a form.
   *
   * @returns - The value of the `disabled` property.
   */
  disabled?: PickProp<IField<Data, Payload>, "disabled">;
  /**
   * Represents the group reference property of a field in a data payload.
   * @typedef groupRef
   * @property groupRef - The group reference value.
   */
  groupRef?: PickProp<IField<Data, Payload>, "groupRef">;
  /**
   * Represents a reference to the input element within a field.
   *
   * @typedef InputRef
   * @property name - The name of the input element.
   * @property id - The unique ID of the input element.
   * @property element - The actual input element.
   */
  inputRef?: PickProp<IField<Data, Payload>, "inputRef">;
  /**
   * Represents the configuration for the leading icon ripple effect.
   *
   * @typedef leadingIconRipple
   * @memberof PickProp<IField<Data, Payload>, 'leadingIconRipple'>
   */
  leadingIconRipple?: PickProp<IField<Data, Payload>, 'leadingIconRipple'>;
  /**
   * Represents the trailing icon ripple configuration for a field.
   *
   * @typedef trailingIconRipple
   */
  trailingIconRipple?: PickProp<IField<Data, Payload>, 'trailingIconRipple'>;
  /**
   * Represents the leading icon for a field.
   *
   * @typedef leadingIcon
   *
   * @property [name] - The name of the leading icon.
   * @property [url] - The URL of the leading icon.
   * @property [color] - The color of the leading icon.
   */
  leadingIcon?: PickProp<IField<Data, Payload>, 'leadingIcon'>;
  /**
   * This is a variable named trailingIcon.
   * The variable is an optional property of type 'PickProp<IField<Data, Payload>, 'trailingIcon'>'.
   *
   * @typedef Data - The data type used by IField.
   * @typedef Payload - The payload type used by IField.
   * @typedef PickProp - The type used to pick properties from IField.
   * @property [trailingIcon] - Optional trailing icon property.
   */
  trailingIcon?: PickProp<IField<Data, Payload>, 'trailingIcon'>;
  /**
   * Represents the optional property 'leadingIconClick' from the 'IField' interface.
   *
   * @template Data - The type of data associated with the field.
   * @template Payload - The type of payload expected when the leading icon is clicked.
   *
   * @param leadingIconClick - The value of the 'leadingIconClick' property.
   *
   * @returns
   */
  leadingIconClick?: PickProp<IField<Data, Payload>, 'leadingIconClick'>;
  /**
   * The `trailingIconClick` property defines the action to be performed when the trailing icon of a field is clicked.
   *
   * @typedef IField
   * @template Data, Payload
   *
   * @param trailingIconClick - The value of the `trailingIconClick` property which defines the action to be performed when the trailing
   * icon is clicked.
   *
   * @description
   * The `trailingIconClick` property accepts a function that will be executed when the trailing icon of a field is clicked.
   */
  trailingIconClick?: PickProp<IField<Data, Payload>, 'trailingIconClick'>;
}

export interface IDictFieldPrivate<Data = IAnything> {
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
 * A component for rendering a DictField.
 *
 * @param DictFieldProps - The props for the DictField component.
 * @param DictFieldProps.invalid - Indicates whether the field is invalid.
 * @param DictFieldProps.incorrect - Indicates whether the field is incorrect.
 * @param DictFieldProps.value - The value of the field.
 * @param DictFieldProps.disabled - Indicates whether the field is disabled.
 * @param DictFieldProps.readonly - Indicates whether the field is readonly.
 * @param DictFieldProps.inputType - The type of the input.
 * @param DictFieldProps.inputAutocomplete - The autocomplete mode for the input.
 * @param DictFieldProps.description - The description for the field.
 * @param DictFieldProps.outlined - Indicates whether the field is outlined.
 * @param DictFieldProps.title - The title for the field.
 * @param DictFieldProps.placeholder - The placeholder text for the field.
 * @param DictFieldProps.dirty - Indicates whether the field has been modified.
 * @param DictFieldProps.loading - Indicates whether the field is loading.
 * @param DictFieldProps.onChange - The event handler for field value change.
 * @param DictFieldProps.dictLimit - The limit of the dictionary items.
 * @param DictFieldProps.dictDelay - The delay for dictionary search.
 * @param DictFieldProps.dictSearch - The search query for the dictionary.
 * @param DictFieldProps.dictOnAppend - The event handler for dictionary item append.
 * @param DictFieldProps.dictOnText - The event handler for dictionary text change.
 * @param DictFieldProps.dictOnItem - The event handler for dictionary item selection.
 * @param DictFieldProps.dictValue - The dictionary item value.
 * @param DictFieldProps.dictSearchText - The search query for dictionary text.
 * @param DictFieldProps.dictSearchItem - The dictionary item for search.
 * @param DictFieldProps.dictCreateButton - Indicates whether to provide a create button for dictionary items.
 * @param DictFieldProps.inputMode - The input mode for the field.
 * @param DictFieldProps.inputPattern - The input pattern for the field.
 * @param DictFieldProps.groupRef - The reference to the group containing the field.
 * @param DictFieldProps.inputRef - The reference to the input field.
 * @param DictFieldProps.inputFormatter - The input formatter function.
 * @param DictFieldProps.inputFormatterAllowed - The allowed characters for input formatting.
 * @param DictFieldProps.inputFormatterReplace - The replacement text for input formatting.
 * @param DictFieldProps.inputFormatterSymbol - The symbol used for input formatting.
 * @param DictFieldProps.inputFormatterTemplate - The template for input formatting.
 * @param DictFieldProps.name - The name of the field.
 * @param DictFieldProps.leadingIcon - The leading icon for the field.
 * @param DictFieldProps.trailingIcon - The trailing icon for the field.
 * @param DictFieldProps.leadingIconClick - The event handler for click on the leading icon.
 * @param DictFieldProps.trailingIconClick - The event handler for click on the trailing icon.
 * @param DictFieldProps.leadingIconRipple - Indicates whether the leading icon should have ripple effect.
 * @param DictFieldProps.trailingIconRipple - Indicates whether the trailing icon should have ripple effect.
 *
 * @return - The rendered DictField component.
 */
export const DictField = ({
  invalid,
  incorrect,
  value,
  disabled,
  readonly,
  inputType = "text",
  inputAutocomplete,
  description = "",
  outlined = false,
  title = "",
  placeholder = "",
  dirty,
  loading,
  onChange,
  dictLimit,
  dictDelay,
  dictSearch,
  dictOnAppend,
  dictOnText,
  dictOnItem,
  dictValue,
  dictSearchText,
  dictSearchItem,
  dictCreateButton,
  inputMode,
  inputPattern,
  groupRef,
  inputRef,
  inputFormatter,
  inputFormatterAllowed,
  inputFormatterReplace,
  inputFormatterSymbol,
  inputFormatterTemplate,
  name,
  leadingIcon,
  trailingIcon,
  leadingIconClick,
  trailingIconClick,
  leadingIconRipple,
  trailingIconRipple,
}: IDictFieldProps & IDictFieldPrivate) => (
  <Dict
    inputRef={inputRef}
    groupRef={groupRef}
    invalid={invalid}
    incorrect={incorrect}
    value={value}
    readonly={readonly}
    disabled={disabled}
    inputType={inputType}
    description={description}
    inputAutocomplete={inputAutocomplete}
    outlined={outlined}
    title={title}
    placeholder={placeholder}
    dirty={dirty}
    loading={loading}
    dictLimit={dictLimit}
    dictDelay={dictDelay}
    dictSearch={dictSearch}
    dictOnAppend={dictOnAppend}
    dictOnText={dictOnText}
    dictOnItem={dictOnItem}
    dictValue={dictValue}
    dictSearchText={dictSearchText}
    dictSearchItem={dictSearchItem}
    dictCreateButton={dictCreateButton}
    inputMode={inputMode}
    inputPattern={inputPattern}
    onChange={onChange}
    name={name}
    inputFormatter={inputFormatter}
    inputFormatterAllowed={inputFormatterAllowed}
    inputFormatterReplace={inputFormatterReplace}
    inputFormatterSymbol={inputFormatterSymbol}
    inputFormatterTemplate={inputFormatterTemplate}
    leadingIcon={leadingIcon}
    trailingIcon={trailingIcon}
    leadingIconClick={leadingIconClick}
    trailingIconClick={trailingIconClick}
    leadingIconRipple={leadingIconRipple}
    trailingIconRipple={trailingIconRipple}
  />
);

DictField.displayName = "DictField";

export default makeField(DictField, {
  withApplyQueue: false,
  skipDirtyClickListener: true,
  skipFocusReadonly: true,
  skipDebounce: true,
});
