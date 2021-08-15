import * as React from 'react';

import Line from '../slots/LineSlot';

import makeField from "../components/makeField";

import { PickProp } from '../model/IManaged';
import IAnything from '../model/IAnything';
import IField from '../model/IField';

export interface ILineFieldProps<Data = IAnything> {
  title?: PickProp<IField<Data>, 'title'>;
}

export const LineField = ({
  title = '',
}: ILineFieldProps) => (
  <Line
    title={title}
  />
);

LineField.displayName = 'LineField';

export default makeField(LineField);
