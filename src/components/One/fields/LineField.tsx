import * as React from 'react';

import Line from '../../../components/One/slots/LineSlot';

import makeField from "../components/makeField";

import { PickProp } from '../../../model/IManaged';
import IAnything from '../../../model/IAnything';
import IField from '../../../model/IField';

const FIELD_NEVER_MARGIN = '0';

/**
 * Represents the properties of a line field.
 * @template Data - The type of data for the field.
 * @template Payload - The type of payload for the field.
 */
export interface ILineFieldProps<Data = IAnything, Payload = IAnything> {
  /**
   * Retrieves the 'title' property from the provided object type with the specified properties.
   *
   * @template T - The object type from which to retrieve the property.
   * @template Key - The property key to pick from the object type.
   * @param obj - The object from which to pick the property.
   * @param key - The key of the property to be picked.
   * @returns The value of the specified property from the object type.
   */
  title?: PickProp<IField<Data, Payload>, 'title'>;
  /**
   * Retrieves the value of the 'lineTransparent' property from the provided object.
   *
   * @template Data - The type of data associated with the field.
   * @template Payload - The type of payload associated with the field.
   * @typedef {PickProp<IField<Data, Payload>, 'lineTransparent'>} lineTransparent
   * @property {boolean} lineTransparent - The value of the 'lineTransparent' property.
   */
  lineTransparent?: PickProp<IField<Data, Payload>, 'lineTransparent'>;
  /**
   * Represents a reference to a group of fields.
   *
   * @typedef {PickProp<IField<Data, Payload>, 'groupRef'>} groupRef
   *
   * @property {string} fieldPath - The path to the group field within the form data structure.
   * @property {boolean} [isRequired] - Indicates if the group field is required or optional.
   * @property {string} [errorMessage] - The error message displayed when the group field is invalid.
   * @property {string} [label] - The label displayed for the group field.
   */
  groupRef?: PickProp<IField<Data, Payload>, 'groupRef'>;
}

/**
 * Renders a Line component with optional transparency and a title.
 *
 * @param props - The props for the LineField component.
 * @param props.title - The title for the Line component.
 * @param props.lineTransparent - Whether the Line component should be transparent.
 * @returns The rendered Line component.
 */
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
  },
  skipFocusBlurCall: true,
});
