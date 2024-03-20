import * as React from 'react';

import Switch from '../../../components/One/slots/SwitchSlot';

import makeField from '../components/makeField';

import IManaged, { PickProp } from '../../../model/IManaged';
import IAnything from '../../../model/IAnything';
import IField from '../../../model/IField';

/**
 * Represents the properties for a switch field component.
 *
 * @template Data - The type of data for the field.
 * @template Payload - The type of payload for the field.
 */
export interface ISwitchFieldProps<Data = IAnything, Payload = IAnything>  {
  title?: PickProp<IField<Data, Payload>, 'title'>;
  groupRef?: PickProp<IField<Data, Payload>, 'groupRef'>;
  readonly?: PickProp<IField<Data, Payload>, "readonly">;
  disabled?: PickProp<IField<Data, Payload>, "disabled">;
  switchNoColor?: PickProp<IField<Data, Payload>, "switchNoColor">;
  switchActiveLabel?: PickProp<IField<Data, Payload>, "switchActiveLabel">;
}

/**
 * Represents a private interface for a switch field.
 *
 * @template Data - The type of data associated with the switch field.
 */
export interface ISwitchFieldPrivate<Data = IAnything>  {
  onChange: PickProp<IManaged<Data>, 'onChange'>;
  value: PickProp<IManaged<Data>, 'value'>;
}

/**
 * Renders a Switch field component.
 *
 * @param props - The properties for the Switch field.
 * @param props.disabled - Indicates whether the Switch field is disabled.
 * @param props.value - The current value of the Switch field.
 * @param props.readonly - Indicates whether the Switch field is read-only.
 * @param props.onChange - The event handler for when the Switch field is changed.
 * @param props.switchNoColor - Indicates whether the Switch field has no color.
 * @param props.switchActiveLabel - The label for the active state of the Switch field.
 * @param props.title - The title of the Switch field.
 *
 * @returns A Switch component wrapped in a SwitchField component.
 */
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
