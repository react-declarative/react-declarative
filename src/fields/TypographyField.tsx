import * as React from 'react';

import { Typography } from '@material-ui/core';

import makeField from '../components/makeField';

import IManaged, { PickProp } from '../model/IManaged';
import IAnything from '../model/IAnything';
import IField from '../model/IField';

export interface ITypographyFieldProps<Data = IAnything> {
  placeholder?: PickProp<IField<Data>, 'placeholder'>;
  typoVariant?: PickProp<IField<Data>, 'typoVariant'>;
  style?: PickProp<IField<Data>, 'style'>;
}

interface ITypographyFieldPrivate<Data = IAnything> {
  value: PickProp<IManaged<Data>, 'value'>;
}

export const TypographyField = ({
  value = '',
  placeholder = '',
  typoVariant = 'body1',
  style,
}: ITypographyFieldProps & ITypographyFieldPrivate) => (
  <Typography variant={typoVariant} style={style}>
    {value || placeholder}
  </Typography>
);

TypographyField.displayName = 'TypographyField';

export default makeField(TypographyField);
