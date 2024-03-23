import * as React from 'react';

import Slider from '../../../components/One/slots/SliderSlot';

import makeField from '../components/makeField';

import IField from '../../../model/IField';
import IAnything from '../../../model/IAnything';
import IManaged, { PickProp } from '../../../model/IManaged';

/**
 * Interface representing the properties of a Slider Field component.
 * @template Data - The data type used in the Field component.
 * @template Payload - The payload type used in the Field component.
 */
export interface ISliderFieldProps<Data = IAnything, Payload = IAnything>  {
  /**
   * Represents the configuration for a step slider field.
   *
   * @typedef {PickProp<IField<Data, Payload>, 'stepSlider'>} stepSlider
   * @property {string} [propertyName] - The name of the property for this step slider field.
   * @property {string} [label] - The label to display for this step slider field.
   * @property {number} [minValue] - The minimum value for the step slider.
   * @property {number} [maxValue] - The maximum value for the step slider.
   * @property {number} [step] - The step interval for the step slider.
   * @property {string} [unit] - The unit of measurement for the step slider.
   */
  stepSlider?: PickProp<IField<Data, Payload>, 'stepSlider'>;
  /**
   * The maximum value for a slider in a field of a data object payload.
   *
   * @typedef {PickProp<IField<Data, Payload>, 'maxSlider'>} maxSlider
   * @property {number} [maxSlider] - The maximum value for the slider. If not provided, there is no maximum limit.
   */
  maxSlider?: PickProp<IField<Data, Payload>, 'maxSlider'>;
  /**
   * The minimum value for a slider in a field.
   *
   * @property {number} [minSlider] - The minimum value for a slider. If undefined, there is no minimum value.
   */
  minSlider?: PickProp<IField<Data, Payload>, 'minSlider'>;
  /**
   * Specifies the format for the labels of a slider component.
   *
   * @typedef {PickProp<IField<Data, Payload>, 'labelFormatSlider'>} labelFormatSlider
   * @property {string} [labelFormatSlider.format] - The format string for the labels.
   */
  labelFormatSlider?: PickProp<IField<Data, Payload>, 'labelFormatSlider'>;
  /**
   * Retrieve the value of the 'leadingIconRipple' property from a given object.
   *
   * @param {IField<Data, Payload>} obj - The object which contains the 'leadingIconRipple' property.
   *
   * @returns {PickProp<IField<Data, Payload>, 'leadingIconRipple'>} The value of the 'leadingIconRipple' property.
   */
  leadingIconRipple?: PickProp<IField<Data, Payload>, 'leadingIconRipple'>;
  /**
   * The `trailingIconRipple` variable is an optional property that represents the ripple effect
   * configuration for the trailing icon in a field component. It is a pick property that is extracted
   * from the `trailingIconRipple` property of the `IField` interface.
   *
   * The `trailingIconRipple` property defines the behavior and appearance of the ripple effect when
   * interacting with the trailing icon.
   *
   * @typedef {PickProp<IField<Data, Payload>, 'trailingIconRipple'>} trailingIconRipple
   */
  trailingIconRipple?: PickProp<IField<Data, Payload>, 'trailingIconRipple'>;
  /**
   * Represents the leading icon of a field.
   *
   * @typedef {PickProp<IField<Data, Payload>, 'leadingIcon'>} leadingIcon
   */
  leadingIcon?: PickProp<IField<Data, Payload>, 'leadingIcon'>;
  /**
   * Sets the trailing icon of the field.
   *
   * @param {PickProp<IField<Data, Payload>, 'trailingIcon'>} trailingIcon - The trailing icon to be set for the field.
   */
  trailingIcon?: PickProp<IField<Data, Payload>, 'trailingIcon'>;
  /**
   * This variable represents an optional function called leadingIconClick, which is a property of the IField interface. It is picked from the PickProp type, using the 'leadingIconClick
   *' key.
   *
   * @typedef {PickProp<IField<Data, Payload>, 'leadingIconClick'>} leadingIconClick
   */
  leadingIconClick?: PickProp<IField<Data, Payload>, 'leadingIconClick'>;
  /**
   * Represents the event handler for when the trailing icon of a field is clicked.
   * @typedef {PickProp<IField<Data, Payload>, 'trailingIconClick'>} trailingIconClick
   */
  trailingIconClick?: PickProp<IField<Data, Payload>, 'trailingIconClick'>;
  /**
   * The color of the slider thumb.
   *
   * @typedef {string} SliderThumbColor
   */
  sliderThumbColor?: PickProp<IField<Data, Payload>, 'sliderThumbColor'>;
  /**
   * The color of the slider track.
   *
   * @property {string} [sliderTrackColor] - The color of the slider track. If not provided, a default color will be used.
   */
  sliderTrackColor?: PickProp<IField<Data, Payload>, 'sliderTrackColor'>;
  /**
   * Retrieves the value of the `sliderRailColor` property from the given object.
   *
   * @param {PickProp<IField<Data, Payload>, 'sliderRailColor'>} input - The input object.
   * @returns {unknown} - The value of the `sliderRailColor` property.
   */
  sliderRailColor?: PickProp<IField<Data, Payload>, 'sliderRailColor'>;
  /**
   * Represents the optional property 'groupRef' of an object of type `IField<Data, Payload>`.
   *
   * @typedef {PickProp<IField<Data, Payload>, 'groupRef'>} groupRef
   * @property {string} [groupRef] - The group reference associated with the field.
   */
  groupRef?: PickProp<IField<Data, Payload>, 'groupRef'>;
  /**
   * Retrieves the `readonly` property value from the provided object.
   *
   * @param {IField<Data, Payload>} obj - The object from which to retrieve the `readonly` property.
   * @returns {PickProp<IField<Data, Payload>, "readonly">} - The value of the `readonly` property.
   */
  readonly?: PickProp<IField<Data, Payload>, "readonly">;
  /**
   * Represents the `disabled` property extracted from a field.
   *
   * @typedef {boolean | undefined} DisabledValue
   */
  disabled?: PickProp<IField<Data, Payload>, "disabled">;
}

/**
 * Represents a private interface for a slider field component.
 *
 * @template Data - The type of data associated with the slider field.
 * @interface ISliderFieldPrivate
 */
export interface ISliderFieldPrivate<Data = IAnything>  {
  value: PickProp<IManaged<Data>, 'value'>;
  onChange: PickProp<IManaged<Data>, 'onChange'>;
}

/**
 * Represents a slider field component.
 * @typedef SliderField
 * @param value - The current value of the slider.
 * @param onChange - A callback function to handle slider value changes.
 * @param leadingIconRipple - Determines if the leading icon should have a ripple effect when clicked.
 * @param trailingIconRipple - Determines if the trailing icon should have a ripple effect when clicked.
 * @param leadingIcon - The icon component to be displayed at the start of the slider.
 * @param trailingIcon - The icon component to be displayed at the end of the slider.
 * @param leadingIconClick - A callback function to handle click events on the leading icon.
 * @param trailingIconClick - A callback function to handle click events on the trailing icon.
 * @param stepSlider - The step value for the slider.
 * @param maxSlider - The maximum value for the slider.
 * @param minSlider - The minimum value for the slider.
 * @param labelFormatSlider - The format string for the label text of the slider.
 * @returns A Slider component with the specified properties.
 */
export const SliderField = ({
  value,
  onChange,
  leadingIconRipple,
  trailingIconRipple,
  leadingIcon,
  trailingIcon,
  leadingIconClick,
  trailingIconClick,
  stepSlider,
  maxSlider,
  minSlider,
  labelFormatSlider,
}: ISliderFieldProps & ISliderFieldPrivate) => (
  <Slider
    value={value}
    onChange={onChange}
    leadingIconRipple={leadingIconRipple}
    trailingIconRipple={trailingIconRipple}
    leadingIcon={leadingIcon}
    trailingIcon={trailingIcon}
    leadingIconClick={leadingIconClick}
    trailingIconClick={trailingIconClick}
    labelFormatSlider={labelFormatSlider}
    stepSlider={stepSlider}
    maxSlider={maxSlider}
    minSlider={minSlider}
  />
);

SliderField.displayName = 'SliderField';

export default makeField(SliderField, {
  withApplyQueue: true,
  skipDirtyClickListener: true,
});
