import * as React from 'react';

import Switch from '../components/One/slots/SwitchSlot';

import makeField from '../components/makeField';

import IManaged, { PickProp } from '../model/IManaged';
import IAnything from '../model/IAnything';
import IField from '../model/IField';

export interface ISwitchFieldProps<Data = IAnything>  {
  title?: PickProp<IField<Data>, 'title'>;
  groupRef?: PickProp<IField<Data>, 'groupRef'>;
}

export interface ISwitchFieldPrivate<Data = IAnything>  {
  onChange: PickProp<IManaged<Data>, 'onChange'>;
  disabled: PickProp<IManaged<Data>, 'disabled'>;
  value: PickProp<IManaged<Data>, 'value'>;
}

export const SwitchField = ({
  disabled,
  value,
  onChange,
  title,
}: ISwitchFieldProps & ISwitchFieldPrivate) => (
  <Switch
    disabled={disabled}
    value={value}
    onChange={onChange}
    title={title}
  />
);

SwitchField.displayName = 'SwitchField';

export default makeField(SwitchField, {
  skipDebounce: true,
});
