import * as React from "react";

import Rating from '../slots/RatingSlot';

import makeField from "../components/makeField";

import IManaged, { PickProp } from "../model/IManaged";
import IAnything from "../model/IAnything";
import IField from "../model/IField";

export interface IRatingFieldProps<Data = IAnything> {
  readonly?: PickProp<IField<Data>, "readonly">;
  title?: PickProp<IField<Data>, "title">;
  groupRef?: PickProp<IField<Data>, 'groupRef'>;
}

export interface IRatingFieldPrivate<Data = IAnything> {
  name?: string;
  value: PickProp<IManaged<Data>, "value">;
  disabled: PickProp<IManaged<Data>, "disabled">;
  onChange: PickProp<IManaged<Data>, "onChange">;
}

export const RatingField = ({
  value,
  disabled,
  readonly,
  title,
  name,
  onChange,
}: IRatingFieldProps & IRatingFieldPrivate) => (
  <Rating
    value={value}
    disabled={disabled}
    readonly={readonly}
    title={title}
    name={name}
    onChange={onChange}
  />
);

RatingField.displayName = 'RatingField';

export default makeField(RatingField, {
  skipDebounce: true,
});
