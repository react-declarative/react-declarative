import * as React from "react";

import Radio from '../../../components/One/slots/RadioSlot';

import makeField from "../components/makeField";

import IField from "../../../model/IField";
import IAnything from "../../../model/IAnything";
import IManaged, { PickProp } from "../../../model/IManaged";

export interface IRadioFieldProps<Data = IAnything, Payload = IAnything> {
  title?: PickProp<IField<Data, Payload>, "title">;
  radioValue?: PickProp<IField<Data, Payload>, "radioValue">;
  groupRef?: PickProp<IField<Data, Payload>, 'groupRef'>;
  readonly?: PickProp<IField<Data, Payload>, "readonly">;
  disabled?: PickProp<IField<Data, Payload>, "disabled">;
}

export interface IRadioFieldPrivate<Data = IAnything> {
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
