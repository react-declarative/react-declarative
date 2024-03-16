import * as React from "react";

import Progress from '../../../components/One/slots/ProgressSlot';

import makeField from "../components/makeField";

import IManaged, { PickProp } from "../../../model/IManaged";
import IField from "../../../model/IField";
import IAnything from "../../../model/IAnything";

export interface IProgressFieldProps<Data = IAnything, Payload = IAnything> {
  maxPercent?: PickProp<IField<Data, Payload>, "maxPercent">;
  showPercentLabel?: PickProp<IField<Data, Payload>, "showPercentLabel">;
  groupRef?: PickProp<IField<Data, Payload>, 'groupRef'>;
}

export interface IProgressFieldPrivate<Data = IAnything> {
  value: PickProp<IManaged<Data>, "value">;
}

/**
 * Represents a progress field component.
 *
 * @typedef {Object} ProgressField
 * @property {number} maxPercent - The maximum percentage value for the progress field.
 * @property {boolean} showPercentLabel - Determines if the percentage label should be displayed.
 * @property {number} value - The current value of the progress field.
 *
 * @param props - The props object containing the properties required for the progress field.
 * @param props.maxPercent - The maximum percentage value for the progress field.
 * @param props.showPercentLabel - Determines if the percentage label should be displayed.
 * @param props.value - The current value of the progress field.
 *
 * @returns The rendered progress field component.
 */
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

export default makeField(ProgressField, {
  skipFocusBlurCall: true,
});
