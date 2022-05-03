import * as React from "react";

import Radio from '../components/One/slots/RadioSlot';

import makeField from "../components/makeField";

import IField from "../model/IField";
import IAnything from "../model/IAnything";
import IManaged, { PickProp } from "../model/IManaged";

export interface IRadioFieldProps<Data = IAnything> {
  title?: PickProp<IField<Data>, "title">;
  radioValue?: PickProp<IField<Data>, "radioValue">;
  groupRef?: PickProp<IField<Data>, 'groupRef'>;
}

export interface IRadioFieldPrivate<Data = IAnything> {
  disabled: PickProp<IManaged<Data>, "disabled">;
  value: PickProp<IManaged<Data>, "value">;
  onChange: PickProp<IManaged<Data>, "onChange">;
  name?: PickProp<IManaged<Data>, 'name'>;
}

export const RadioField = ({
  disabled,
  value,
  onChange,
  title,
  radioValue,
  name = '',
}: IRadioFieldProps & IRadioFieldPrivate) => (
  <Radio
    value={value}
    disabled={disabled}
    onChange={onChange}
    title={title}
    radioValue={radioValue}
    name={name}
  />
);

RadioField.displayName = 'RadioField';

export default makeField(RadioField, {
  skipDebounce: true,
});
