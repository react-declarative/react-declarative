import * as React from 'react';

import Switch from '../../../components/One/slots/SwitchSlot';

import makeField from '../components/makeField';

import IManaged, { PickProp } from '../../../model/IManaged';
import IAnything from '../../../model/IAnything';
import IField from '../../../model/IField';

export interface ISwitchFieldProps<Data = IAnything, Payload = IAnything>  {
  title?: PickProp<IField<Data, Payload>, 'title'>;
  groupRef?: PickProp<IField<Data, Payload>, 'groupRef'>;
  readonly?: PickProp<IField<Data, Payload>, "readonly">;
  disabled?: PickProp<IField<Data, Payload>, "disabled">;
}

export interface ISwitchFieldPrivate<Data = IAnything>  {
  onChange: PickProp<IManaged<Data>, 'onChange'>;
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
