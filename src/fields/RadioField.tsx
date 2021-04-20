import * as React from "react";

import { FormControlLabel, FormGroup, Radio, RadioGroup } from "@material-ui/core";

import makeField from "../components/makeField";

import IField from "../model/IField";
import IEntity from "../model/IEntity";
import IAnything from "../model/IAnything";
import IManaged, { PickProp } from "../model/IManaged";

export interface IRadioFieldProps<Data = IAnything> {
  title?: PickProp<IField<Data>, "title">;
  radioValue?: PickProp<IField<Data>, "radioValue">;
}

interface IRadioFieldPrivate<Data = IAnything> {
  disabled: PickProp<IManaged<Data>, "disabled">;
  value: PickProp<IManaged<Data>, "value">;
  onChange: PickProp<IManaged<Data>, "onChange">;
  name?: PickProp<IEntity<Data>, 'name'>;
}

export const RadioField = ({
  disabled,
  value,
  onChange,
  title,
  radioValue,
  name = '',
}: IRadioFieldProps & IRadioFieldPrivate) => (
  <FormGroup>
    <RadioGroup
      name={name}
      value={value}
      onChange={() => onChange((radioValue || '').toString())}
    >
      <FormControlLabel value={radioValue} control={<Radio disabled={disabled} />} label={title} />
    </RadioGroup>
  </FormGroup>
);

RadioField.displayName = 'RadioField';

export default makeField(RadioField, {
  skipDebounce: true,
});
