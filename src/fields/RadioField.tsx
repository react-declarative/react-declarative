import * as React from "react";

import { FormControlLabel, FormGroup, Radio, RadioGroup } from "@material-ui/core";

import makeField from "../components/makeField";
import IManaged, { PickProp } from "../model/IManaged";
import IField from "../model/IField";
import IEntity from "../model/IEntity";

export interface IRadioFieldProps {
  title?: PickProp<IField, "title">;
  radioValue?: string;
}

interface IRadioFieldPrivate {
  disabled: PickProp<IManaged, "disabled">;
  value: PickProp<IManaged, "value">;
  onChange: PickProp<IManaged, "onChange">;
  name?: PickProp<IEntity, 'name'>;
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

export default makeField(RadioField, true);
