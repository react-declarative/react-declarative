import IData, { Value } from "../model/IData";

import isObject from '../../../utils/isObject';

/**
 * Converts an array of IData objects to key-value pairs.
 *
 * @param array - The array of IData objects to be converted.
 * @returns - The converted key-value pairs as an IData object.
 */
const arrayToEntries = (array: Array<IData>): IData =>
  Object.fromEntries(
    Object.entries(array).map(([key, value]) => [
      `Item ${parseFloat(key) + 1}`,
      value,
    ]),
  );

/**
 * Converts an object (root) into an array of key-value pairs (entries).
 *
 * @param root - The object to be converted into entries.
 * @returns - An object containing key-value pairs representing the entries.
 */
export const objectToEntries = (root: IData) => {
  const process = (obj: IData | Value, target: IData = {}) => {
    Object.entries(obj || {}).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        target[key] = process(arrayToEntries(value));
      } else if (isObject(value)) {
        target[key] = process(value);
      } else {
        target[key] = value;
      }
    });
    return target;
  };
  return process(root);
};

export default objectToEntries;
