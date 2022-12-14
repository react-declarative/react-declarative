import * as React from 'react';

import Typography from '../../../components/One/slots/TypographySlot';

import makeField from '../components/makeField';

import IManaged, { PickProp } from '../../../model/IManaged';
import IAnything from '../../../model/IAnything';
import IField from '../../../model/IField';

export interface ITypographyFieldProps<Data = IAnything, Payload = IAnything> {
  placeholder?: PickProp<IField<Data, Payload>, 'placeholder'>;
  typoVariant?: PickProp<IField<Data, Payload>, 'typoVariant'>;
  className?: PickProp<IField<Data, Payload>, 'className'>;
  style?: PickProp<IField<Data, Payload>, 'style'>;
  groupRef?: PickProp<IField<Data, Payload>, 'groupRef'>;
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
