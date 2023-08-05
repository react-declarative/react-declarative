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

export default makeField(SliderField, {
  withApplyQueue: true,
  skipDirtyClickListener: true,
});
