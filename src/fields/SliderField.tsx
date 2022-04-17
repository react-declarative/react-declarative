import * as React from 'react';

import Slider from '../slots/SliderSlot';

import makeField from '../components/makeField';

import IField from '../model/IField';
import IAnything from '../model/IAnything';
import IManaged, { PickProp } from '../model/IManaged';

export interface ISliderFieldProps<Data = IAnything>  {
  stepSlider?: PickProp<IField<Data>, 'stepSlider'>;
  maxSlider?: PickProp<IField<Data>, 'maxSlider'>;
  minSlider?: PickProp<IField<Data>, 'minSlider'>;
  labelFormatSlider?: PickProp<IField<Data>, 'labelFormatSlider'>;
  leadingIcon?: PickProp<IField<Data>, 'leadingIcon'>;
  trailingIcon?: PickProp<IField<Data>, 'trailingIcon'>;
  leadingIconClick?: PickProp<IField<Data>, 'leadingIconClick'>;
  trailingIconClick?: PickProp<IField<Data>, 'trailingIconClick'>;
  sliderThumbColor?: PickProp<IField<Data>, 'sliderThumbColor'>;
  sliderTrackColor?: PickProp<IField<Data>, 'sliderTrackColor'>;
  sliderRailColor?: PickProp<IField<Data>, 'sliderRailColor'>;
  groupRef?: PickProp<IField<Data>, 'groupRef'>;
}

export interface ISliderFieldPrivate<Data = IAnything>  {
  value: PickProp<IManaged<Data>, 'value'>;
  onChange: PickProp<IManaged<Data>, 'onChange'>;
}

export const SliderField = ({
  value,
  onChange,
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

export default makeField(SliderField);
