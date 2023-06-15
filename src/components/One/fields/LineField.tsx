import * as React from 'react';

import Line from '../../../components/One/slots/LineSlot';

import makeField from "../components/makeField";

import { PickProp } from '../../../model/IManaged';
import IAnything from '../../../model/IAnything';
import IField from '../../../model/IField';

const FIELD_NEVER_MARGIN = '0';

export interface ILineFieldProps<Data = IAnything, Payload = IAnything> {
  title?: PickProp<IField<Data, Payload>, 'title'>;
  lineTransparent?: PickProp<IField<Data, Payload>, 'lineTransparent'>;
  groupRef?: PickProp<IField<Data, Payload>, 'groupRef'>;
}

export const LineField = ({
  title = '',
  lineTransparent = false,
}: ILineFieldProps) => (
  <Line
    lineTransparent={lineTransparent}
    title={title}
  />
);

LineField.displayName = 'LineField';

export default makeField(LineField, {
  defaultProps: {
    fieldRightMargin: FIELD_NEVER_MARGIN,
    fieldBottomMargin: FIELD_NEVER_MARGIN,
  }
});
