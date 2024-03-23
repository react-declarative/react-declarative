import * as React from 'react';

import Typography from '../../../components/One/slots/TypographySlot';

import makeField from '../components/makeField';

import IManaged, { PickProp } from '../../../model/IManaged';
import IAnything from '../../../model/IAnything';
import IField from '../../../model/IField';

/**
 * Interface for props of the TypographyField component.
 *
 * @template Data - The data type of the field.
 * @template Payload - The payload type of the field.
 */
export interface ITypographyFieldProps<Data = IAnything, Payload = IAnything> {
  /**
   * Retrieves the `placeholder` property from the given `IField` object.
   * The `placeholder` property is a key of type `PickProp`.
   *
   * @param {IField<Data, Payload>} field - The input field object.
   * @returns {PickProp<IField<Data, Payload>, 'placeholder'>} - The `placeholder` property of the field object.
   */
  placeholder?: PickProp<IField<Data, Payload>, 'placeholder'>;
  /**
   * Represents the `typoVariant` property of an object.
   * @typedef {PickProp<IField<Data, Payload>, 'typoVariant'>} TypoVariant
   * @property {IField<Data, Payload>} - The object from which the `typoVariant` property is picked.
   * @property {'typoVariant'} - The name of the property being picked.
   * @property {*} - The value of the `typoVariant` property.
   */
  typoVariant?: PickProp<IField<Data, Payload>, 'typoVariant'>;
  /**
   * Gets the value of the className property from the provided object.
   *
   * This function uses the PickProp type from the IField interface to pick the 'className' property
   * from the provided object based on the Data and Payload generic types.
   *
   * @template Data - The type of the data in the IField interface.
   * @template Payload - The type of the payload in the IField interface.
   * @param {IField<Data, Payload>} obj - The object from which to get the className property.
   * @returns {PickProp<IField<Data, Payload>, 'className'> | undefined} The value of the className property, or undefined if it doesn't exist.
   */
  className?: PickProp<IField<Data, Payload>, 'className'>;
  /**
   * Retrieves the 'style' property of the given variable, using the 'PickProp' utility type.
   *
   * @template Data - The type of the field's data.
   * @template Payload - The type of the field's payload.
   * @template T - The type of the variable to pick property from.
   */
  style?: PickProp<IField<Data, Payload>, 'style'>;
  /**
   * Represents a reference to a group in a field.
   * This reference is optional.
   *
   * @typedef {PickProp<IField<Data, Payload>, 'groupRef'>} groupRef
   */
  groupRef?: PickProp<IField<Data, Payload>, 'groupRef'>;
}

/**
 * Represents a private interface for a typography field.
 *
 * @template Data - The type of data the field holds.
 */
export interface ITypographyFieldPrivate<Data = IAnything> {
  value: PickProp<IManaged<Data>, 'value'>;
}

/**
 * Renders a typography field component.
 *
 * @param props - The props for the typography field.
 * @param [props.value=''] - The value of the typography field.
 * @param [props.placeholder=''] - The placeholder text for the typography field.
 * @param [props.typoVariant='body1'] - The typography variant for the field.
 * @param [props.style] - Additional styles to be applied to the field.
 * @returns - The rendered typography field component.
 */
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

export default makeField(TypographyField, {
  skipFocusBlurCall: true,
});
