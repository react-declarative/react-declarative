import isObject from '../../../utils/isObject';

import IData from '../model/IData';

/**
 * Represents a collection of records, where each record is a tuple containing a key-value pair.
 * @typedef {Array<[keyof IData, IData[keyof IData]]>} IDataRecords
 */
type IDataRecords = Array<[keyof IData, IData[keyof IData]]>;

/**
 * Represents an entry that contains path, value, and deepIndex.
 *
 * @typedef {Object} Entry
 * @property {string} path - The path of the entry.
 * @property {string} value - The value of the entry.
 * @property {number} deepIndex - The deep index of the entry.
 */
type Entry = {
  path: string;
  value: string;
  deepIndex: number;
};

/**
 * Flattens a nested object into an array of entries.
 *
 * @param record - The nested object to flatten.
 * @returns - An array of flattened entries.
 */
export const deepFlat = (record: IData) => {
  const result: Array<Entry> = [];
  let pendingDeepIndex = 0;
  const process = (entries: IDataRecords, prefix = '') =>
    entries.forEach((entry) => {
      const [key, value] = entry;
      const name = `${prefix}.${String(key)}`;
      if (isObject(value)) {
        result.push({ path: name, value: '', deepIndex: pendingDeepIndex });
        pendingDeepIndex += 1;
        process(Object.entries(value), name);
      } else {
        result.push({
          path: name,
          value: String(value),
          deepIndex: pendingDeepIndex,
        });
        pendingDeepIndex += 1;
      }
    });
  process(Object.entries(record), 'root');
  return result;
};

export default deepFlat;
