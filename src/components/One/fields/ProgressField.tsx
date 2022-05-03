import * as React from "react";

import Progress from '../../../components/One/slots/ProgressSlot';

import makeField from "../components/makeField";

import IManaged, { PickProp } from "../../../model/IManaged";
import IField from "../../../model/IField";
import IAnything from "../../../model/IAnything";

export interface IProgressFieldProps<Data = IAnything> {
  maxPercent?: PickProp<IField<Data>, "maxPercent">;
  showPercentLabel?: PickProp<IField<Data>, "showPercentLabel">;
  groupRef?: PickProp<IField<Data>, 'groupRef'>;
}

export interface IProgressFieldPrivate<Data = IAnything> {
  value: PickProp<IManaged<Data>, "value">;
}

export const ProgressField = ({
  maxPercent = 1.0,
  showPercentLabel,
  value,
}: IProgressFieldProps & IProgressFieldPrivate) => (
  <Progress
    showPercentLabel={showPercentLabel}
    maxPercent={maxPercent}
    value={value}
  />
);

ProgressField.displayName = 'ProgressField';

export default makeField(ProgressField);
