import * as React from 'react';

import { Checkbox, FormControlLabel, FormGroup } from '@material-ui/core';

import makeField from "../components/makeField";
import IManaged, { PickProp } from '../model/IManaged';
import IField from '../model/IField';

export interface ICheckboxFieldProps {
  title?: PickProp<IField, 'title'>;
}

export interface ICheckboxFieldPrivate {
  value: PickProp<IManaged, 'value'>;
  disabled: PickProp<IManaged, 'disabled'>;
  onChange: PickProp<IManaged, 'onChange'>;
}

export const CheckboxField = ({
  disabled,
  value,
  onChange,
  title
}: ICheckboxFieldProps & ICheckboxFieldPrivate) => (
  <FormGroup>
    <FormControlLabel
      control={<Checkbox disabled={disabled} checked={Boolean(value)} onChange={() => onChange(!value)} />}
      label={title} />
  </FormGroup>
);

CheckboxField.displayName = 'CheckboxField';

export default makeField(CheckboxField);
