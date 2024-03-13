import * as React from 'react';

import Slider from '../../../components/One/slots/SliderSlot';

import makeField from '../components/makeField';

import IField from '../../../model/IField';
import IAnything from '../../../model/IAnything';
import IManaged, { PickProp } from '../../../model/IManaged';

export interface ISliderFieldProps<Data = IAnything, Payload = IAnything>  {
  stepSlider?: PickProp<IField<Data, Payload>, 'stepSlider'>;
  maxSlider?: PickProp<IField<Data, Payload>, 'maxSlider'>;
  minSlider?: PickProp<IField<Data, Payload>, 'minSlider'>;
  labelFormatSlider?: PickProp<IField<Data, Payload>, 'labelFormatSlider'>;
  leadingIconRipple?: PickProp<IField<Data, Payload>, 'leadingIconRipple'>;
  trailingIconRipple?: PickProp<IField<Data, Payload>, 'trailingIconRipple'>;
  leadingIcon?: PickProp<IField<Data, Payload>, 'leadingIcon'>;
  trailingIcon?: PickProp<IField<Data, Payload>, 'trailingIcon'>;
  leadingIconClick?: PickProp<IField<Data, Payload>, 'leadingIconClick'>;
  trailingIconClick?: PickProp<IField<Data, Payload>, 'trailingIconClick'>;
  sliderThumbColor?: PickProp<IField<Data, Payload>, 'sliderThumbColor'>;
  sliderTrackColor?: PickProp<IField<Data, Payload>, 'sliderTrackColor'>;
  sliderRailColor?: PickProp<IField<Data, Payload>, 'sliderRailColor'>;
  groupRef?: PickProp<IField<Data, Payload>, 'groupRef'>;
  readonly?: PickProp<IField<Data, Payload>, "readonly">;
  disabled?: PickProp<IField<Data, Payload>, "disabled">;
}

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
