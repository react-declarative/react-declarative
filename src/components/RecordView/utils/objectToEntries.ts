import IData, { Value } from "../model/IData";

import isObject from '../../../utils/isObject';

const arrayToEntries = (array: Array<IData>): IData =>
  Object.fromEntries(
    Object.entries(array).map(([key, value]) => [
      `Item ${parseFloat(key) + 1}`,
      value,
    ]),
  );

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
