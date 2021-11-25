import * as React from 'react';

import Typography from '../slots/TypographySlot';

import makeField from '../components/makeField';

import IManaged, { PickProp } from '../model/IManaged';
import IAnything from '../model/IAnything';
import IField from '../model/IField';

export interface ITypographyFieldProps<Data = IAnything> {
  placeholder?: PickProp<IField<Data>, 'placeholder'>;
  typoVariant?: PickProp<IField<Data>, 'typoVariant'>;
  style?: PickProp<IField<Data>, 'style'>;
  groupRef?: PickProp<IField<Data>, 'groupRef'>;
}

export interface ITypographyFieldPrivate<Data = IAnything> {
  value: PickProp<IManaged<Data>, 'value'>;
}

export const TypographyField = ({
  value = '',
  placeholder = '',
  typoVariant = 'body1',
  style,
}: ITypographyFieldProps & ITypographyFieldPrivate) => (
  <Typography
    value={value}
    placeholder={placeholder}
    typoVariant={typoVariant}
    style={style}
  />
);

TypographyField.displayName = 'TypographyField';

export default makeField(TypographyField);
