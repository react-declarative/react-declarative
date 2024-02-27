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
  switchNoColor?: PickProp<IField<Data, Payload>, "switchNoColor">;
  switchActiveLabel?: PickProp<IField<Data, Payload>, "switchActiveLabel">;
}

export interface ISwitchFieldPrivate<Data = IAnything>  {
  onChange: PickProp<IManaged<Data>, 'onChange'>;
  value: PickProp<IManaged<Data>, 'value'>;
}

export const SwitchField = ({
  disabled,
  value,
  readonly,
  onChange,
  switchNoColor,
  switchActiveLabel,
  title,
}: ISwitchFieldProps & ISwitchFieldPrivate) => (
  <Switch
    readonly={readonly}
    disabled={disabled}
    value={value}
    onChange={onChange}
    switchNoColor={switchNoColor}
    switchActiveLabel={switchActiveLabel}
    title={title}
  />
);

SwitchField.displayName = 'SwitchField';

export default makeField(SwitchField, {
  withApplyQueue: true,
  skipDebounce: true,
  skipDirtyClickListener: true,
  skipFocusReadonly: true,
});
