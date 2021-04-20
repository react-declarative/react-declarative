import * as React from 'react';

import { Checkbox, FormControlLabel, FormGroup } from '@material-ui/core';

import makeField from "../components/makeField";

import IManaged, { PickProp } from '../model/IManaged';
import IAnything from '../model/IAnything';
import IField from '../model/IField';

export interface ICheckboxFieldProps<Data = IAnything> {
  title?: PickProp<IField<Data>, 'title'>;
}

export interface ICheckboxFieldPrivate<Data = IAnything>  {
  value: PickProp<IManaged<Data>, 'value'>;
  disabled: PickProp<IManaged<Data>, 'disabled'>;
  onChange: PickProp<IManaged<Data>, 'onChange'>;
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

export default makeField(CheckboxField, {
  skipDebounce: true,
});
