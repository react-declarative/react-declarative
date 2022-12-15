import IData from '../model/IData';

type IDataRecords = Array<[keyof IData, IData[keyof IData]]>;

type Entry = {
  path: string;
  value: string;
  deepIndex: number;
};

export const deepFlat = (record: IData) => {
  const result: Array<Entry> = [];
  let pendingDeepIndex = 0;
  const process = (entries: IDataRecords, prefix = '') =>
    entries.forEach((entry) => {
      const [key, value] = entry;
      const name = `${prefix}.${String(key)}`;
      if (typeof value === 'object') {
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
