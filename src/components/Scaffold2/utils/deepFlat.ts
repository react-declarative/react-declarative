import IScaffold2Group, { IScaffold2GroupInternal } from '../model/IScaffold2Group';
import IScaffold2Option, { IScaffold2OptionInternal } from '../model/IScaffold2Option';

type GroupRecords = {
  [Prop in keyof IScaffold2Group]: IScaffold2Group[Prop];
} & IScaffold2GroupInternal;

type OptionRecords = {
  [Prop in keyof IScaffold2Option]: IScaffold2Option[Prop];
} & IScaffold2OptionInternal;

type Entry = GroupRecords & OptionRecords;

export const deepFlat = (records: IScaffold2Group[]) => {
  const result: Array<Entry> = [];
  const process = (entries: Entry[], prefix = 'root') =>
    entries.forEach((entry) => {
      const name = `${prefix}.${entry.id}`;
      if (Array.isArray(entry.children)) {
        entry.path = name;
        result.push(entry);
        process(entry.children as Entry[], name);
      } else if (Array.isArray(entry.options)) {
        entry.path = name;
        result.push(entry);
        process(entry.options as Entry[], name);
      } else {
        entry.path = name;
        result.push(entry);
      }
    });
  process(records as Entry[]);
  return result;
};

export default deepFlat;
