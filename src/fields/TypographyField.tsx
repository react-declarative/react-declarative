import * as React from 'react';

import { Typography } from '@material-ui/core';

import makeField from '../components/makeField';
import IManaged, { PickProp } from '../model/IManaged';
import IField from '../model/IField';

export interface ITypographyFieldProps {
  placeholder?: PickProp<IField, 'placeholder'>;
  typoVariant?: PickProp<IField, 'typoVariant'>;
}

interface ITypographyFieldPrivate {
  value: PickProp<IManaged, 'value'>;
}

export const TypographyField = ({
  value = '',
  placeholder = '',
  typoVariant = 'body1',
}: ITypographyFieldProps & ITypographyFieldPrivate) => (
  <Typography variant={typoVariant}>
    {value || placeholder}
  </Typography>
);

TypographyField.displayName = 'TypographyField';

export default makeField(TypographyField, false);
