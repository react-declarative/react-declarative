import * as React from "react";

import Tree from '../../../components/One/slots/TreeSlot';

import makeField from "../components/makeField";

import IManaged, { PickProp } from "../../../model/IManaged";
import IAnything from "../../../model/IAnything";
import IField from "../../../model/IField";

export interface ITreeFieldProps<Data = IAnything, Payload = IAnything> {
  description?: PickProp<IField<Data, Payload>, "description">;
  outlined?: PickProp<IField<Data, Payload>, "outlined">;
  title?: PickProp<IField<Data, Payload>, "title">;
  placeholder?: PickProp<IField<Data, Payload>, "placeholder">;
  labelShrink?: PickProp<IField<Data>, "labelShrink">;
  readonly?: PickProp<IField<Data, Payload>, "readonly">;
  disabled?: PickProp<IField<Data, Payload>, "disabled">;
  groupRef?: PickProp<IField<Data, Payload>, 'groupRef'>;
  itemTree?: PickProp<IField<Data, Payload>, 'itemTree'>;
  tr?: PickProp<IField<Data, Payload>, 'tr'>;
}

export interface ITreeFieldPrivate<Data = IAnything> {
  onChange: PickProp<IManaged<Data>, "onChange">;
  invalid: PickProp<IManaged<Data>, "invalid">;
  incorrect: PickProp<IManaged<Data>, "incorrect">;
  value: PickProp<IManaged<Data>, "value">;
  loading: PickProp<IManaged<Data>, "loading">;
  disabled: PickProp<IManaged<Data>, "disabled">;
  dirty: PickProp<IManaged<Data>, "dirty">;
  name: PickProp<IManaged<Data>, "name">;
  withContextMenu: PickProp<IManaged<Data>, "withContextMenu">;
}

export const TreeField = ({
  invalid,
  value,
  disabled,
  readonly,
  incorrect,
  description = "",
  outlined = false,
  title = "",
  placeholder = "",
  itemTree,
  dirty,
  loading,
  onChange,
  name,
  withContextMenu,
}: ITreeFieldProps & ITreeFieldPrivate) => (
  <Tree
    invalid={invalid}
    incorrect={incorrect}
    value={value}
    readonly={readonly}
    disabled={disabled}
    description={description}
    outlined={outlined}
    title={title}
    placeholder={placeholder}
    withContextMenu={withContextMenu}
    itemTree={itemTree}
    dirty={dirty}
    loading={loading}
    onChange={onChange}
    name={name}
  />
);

TreeField.displayName = 'TreeField';

export default makeField(TreeField, {
  withApplyQueue: true,
  skipDirtyClickListener: true,
  skipFocusReadonly: true,
  skipDebounce: true,
});
