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
   * @typedef stepSlider
   * @property [propertyName] - The name of the property for this step slider field.
   * @property [label] - The label to display for this step slider field.
   * @property [minValue] - The minimum value for the step slider.
   * @property [maxValue] - The maximum value for the step slider.
   * @property [step] - The step interval for the step slider.
   * @property [unit] - The unit of measurement for the step slider.
   */
  stepSlider?: PickProp<IField<Data, Payload>, 'stepSlider'>;
  /**
   * The maximum value for a slider in a field of a data object payload.
   *
   * @typedef maxSlider
   * @property [maxSlider] - The maximum value for the slider. If not provided, there is no maximum limit.
   */
  maxSlider?: PickProp<IField<Data, Payload>, 'maxSlider'>;
  /**
   * The minimum value for a slider in a field.
   *
   * @property [minSlider] - The minimum value for a slider. If undefined, there is no minimum value.
   */
  minSlider?: PickProp<IField<Data, Payload>, 'minSlider'>;
  /**
   * Specifies the format for the labels of a slider component.
   *
   * @typedef labelFormatSlider
   * @property [labelFormatSlider.format] - The format string for the labels.
   */
  labelFormatSlider?: PickProp<IField<Data, Payload>, 'labelFormatSlider'>;
  /**
   * Retrieve the value of the 'leadingIconRipple' property from a given object.
   *
   * @param obj - The object which contains the 'leadingIconRipple' property.
   *
   * @returns The value of the 'leadingIconRipple' property.
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
   * @typedef trailingIconRipple
   */
  trailingIconRipple?: PickProp<IField<Data, Payload>, 'trailingIconRipple'>;
  /**
   * Represents the leading icon of a field.
   *
   * @typedef leadingIcon
   */
  leadingIcon?: PickProp<IField<Data, Payload>, 'leadingIcon'>;
  /**
   * Sets the trailing icon of the field.
   *
   * @param trailingIcon - The trailing icon to be set for the field.
   */
  trailingIcon?: PickProp<IField<Data, Payload>, 'trailingIcon'>;
  /**
   * This variable represents an optional function called leadingIconClick, which is a property of the IField interface. It is picked from the PickProp type, using the 'leadingIconClick
   *' key.
   *
   * @typedef leadingIconClick
   */
  leadingIconClick?: PickProp<IField<Data, Payload>, 'leadingIconClick'>;
  /**
   * Represents the event handler for when the trailing icon of a field is clicked.
   * @typedef trailingIconClick
   */
  trailingIconClick?: PickProp<IField<Data, Payload>, 'trailingIconClick'>;
  /**
   * The color of the slider thumb.
   *
   * @typedef SliderThumbColor
   */
  sliderThumbColor?: PickProp<IField<Data, Payload>, 'sliderThumbColor'>;
  /**
   * The color of the slider track.
   *
   * @property [sliderTrackColor] - The color of the slider track. If not provided, a default color will be used.
   */
  sliderTrackColor?: PickProp<IField<Data, Payload>, 'sliderTrackColor'>;
  /**
   * Retrieves the value of the `sliderRailColor` property from the given object.
   *
   * @param input - The input object.
   * @returns - The value of the `sliderRailColor` property.
   */
  sliderRailColor?: PickProp<IField<Data, Payload>, 'sliderRailColor'>;

  /**
   * Defines custom steps for the slider component.
   *
   * @typedef sliderSteps
   * @property [sliderSteps] - An array of values representing the discrete steps the slider can take.
   * If provided, the slider will only allow selection of these specific values.
   */
  sliderSteps?: PickProp<IField<Data, Payload>, 'sliderSteps'>;

  /**
   * Represents the optional property 'groupRef' of an object of type `IField<Data, Payload>`.
   *
   * @typedef groupRef
   * @property [groupRef] - The group reference associated with the field.
   */
  groupRef?: PickProp<IField<Data, Payload>, 'groupRef'>;
  /**
   * Retrieves the `readonly` property value from the provided object.
   *
   * @param obj - The object from which to retrieve the `readonly` property.
   * @returns - The value of the `readonly` property.
   */
  readonly?: PickProp<IField<Data, Payload>, "readonly">;
  /**
   * Represents the `disabled` property extracted from a field.
   *
   * @typedef DisabledValue
   */
  disabled?: PickProp<IField<Data, Payload>, "disabled">;
  leadingIconTabIndex?: PickProp<IField<Data, Payload>, 'leadingIconTabIndex'>;
  trailingIconTabIndex?: PickProp<IField<Data, Payload>, 'trailingIconTabIndex'>;
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
  sliderSteps,
  maxSlider,
  minSlider,
  labelFormatSlider,
  leadingIconTabIndex,
  trailingIconTabIndex,
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
    sliderSteps={sliderSteps}
    minSlider={minSlider}
    leadingIconTabIndex={leadingIconTabIndex}
    trailingIconTabIndex={trailingIconTabIndex}
  />
);

SliderField.displayName = 'SliderField';

export default makeField(SliderField, {
  skipDebounce: true,
  withApplyQueue: true,
  skipDirtyClickListener: true,
});
